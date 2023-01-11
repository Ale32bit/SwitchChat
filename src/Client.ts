import * as events from "events";
import * as constants from "./constants";
import WebSocket from "ws";

import * as hello from "./packets/Hello";
import {Data} from "./packets/Data";
import {Hello} from "./packets/Hello";
import {User} from "./types/User";
import {Players} from "./packets/Players";
import {BaseEvent} from "./events/BaseEvent";
import {IngameChatMessage} from "./events/IngameChatMessage";
import {DiscordChatMessage} from "./events/DiscordChatMessage";
import {ChatboxChatMessage} from "./events/ChatboxChatMessage";
import {ChatboxCommand} from "./events/ChatboxCommand";
import {Join} from "./events/Join";
import {Leave} from "./events/Leave";
import {Death} from "./events/Death";
import {AFK} from "./events/AFK";
import {AFKReturn} from "./events/AFKReturn";

export declare interface Client {
    owner: string | undefined,
    capabilities: string[],
    players: User[],

    on(event: "ready", listener: () => void): this;
    on(event: "players", listener: () => void): this;
    on(event: "raw", listener: (rawData: { [key: string]: any }) => void): this;

    // Server Events
    on(event: "chat_ingame", listener: (message: IngameChatMessage) => void): this;
    on(event: "chat_discord", listener: (message: DiscordChatMessage) => void): this;
    on(event: "chat_chatbox", listener: (message: ChatboxChatMessage) => void): this;
    on(event: "command", listener: (command: ChatboxCommand) => void): this;
    on(event: "join", listener: (join: Join) => void): this;
    on(event: "leave", listener: (leave: Leave) => void): this;
    on(event: "death", listener: (death: Death) => void): this;
    on(event: "afk", listener: (afk: AFK) => void): this;
    on(event: "afk_return", listener: (afkReturn: AFKReturn) => void): this;
    on(event: "server_restart_scheduled", listener: (event: BaseEvent) => void): this;
    on(event: "server_restart_cancelled", listener: (event: BaseEvent) => void): this;
}

export class Client extends events.EventEmitter {
    owner: string | undefined;
    capabilities: string[]
    private readonly _token: string;
    private _ws: WebSocket;

    constructor(token: string) {
        super();
        this._token = token;
        this.capabilities = [];

        this._ws = new WebSocket(constants.endpoint + this._token);
        this._ws.on("message", this._onMessage.bind(this))
    }

    private _onMessage(rawData: string) {
        const data: Data = JSON.parse(rawData);
        this.emit("raw", data);

        switch (data.type) {
            case "hello":
                let hello = data as Hello;

                this.owner = hello.licenseOwner;
                this.capabilities = hello.capabilities;

                this.emit("ready");

                break;

            case "players":
                let playersData = data as Players;
                this.players = playersData.players;
                this.emit("players", this.players);
                break;

            case "event":
                let event = data as BaseEvent;
                event.time = new Date(event.time);
                this._handleEvent(event);
                break;
        }
    }

    private _handleEvent(event: BaseEvent) {
        this.emit(event.event, event)
    }
}