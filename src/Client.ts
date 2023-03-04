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
import {QueueMessage} from "./types/QueueMessage";
import {Success} from "./packets/Success";
import {Error} from "./packets/Error";
import {Closing} from "./packets/Closing";

export declare interface Client {
    /**
     * Name of the owner of the chatbox license
     */
    owner: string;

    /**
     * List of capabilities this chatbox license can do
     */
    capabilities: string[];

    /**
     * List of currently online players
     */
    players: User[];

    /**
     * Default name for chatbox messages
     */
    defaultName: string | undefined;
    /**
     * Default formatting mode for say and tell messages.
     * Defaults to "markdown"
     */
    defaultFormattingMode: constants.mode;

    /**
     * Connect to the Chatbox server
     * @param callback Callback to run when the connection is open
     */
    connect(callback?: (client?: Client) => void): void;

    /**
     * Close the connection to the Chatbox server
     */
    close(): void;

    /**
     * Close and reconnect to the Chatbox server
     * @param wait Whether to wait before reconnecting.
     */
    reconnect(wait?: boolean): void;

    say(text: string, name?: string, mode?: constants.mode): Promise<Success>;

    tell(user: string, text: string, name?: string, mode?: constants.mode): Promise<Success>;

    on(event: "ready", listener: () => void): this;

    on(event: "players", listener: () => void): this;

    on(event: "closing", listener: () => void): this;

    on(event: "error", listener: () => void): this;

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
    owner: string = "Guest";
    capabilities: string[];
    players: User[] = [];
    defaultName: string | undefined;
    defaultFormattingMode: constants.mode = constants.mode.markdown;
    waitTimeRestart: number = 60000;
    private _delay: number = 500;
    private readonly _queue: QueueMessage[] = [];
    private readonly _awaitingQueue: { [key: number]: QueueMessage } = {};

    private readonly _token: string;
    private _ws?: WebSocket;
    private _queueInterval?: NodeJS.Timer;
    private _queueCounter = 0;

    constructor(token: string) {
        super();
        this.capabilities = [];

        this._token = token;

        this.on("afk",        e => this.updatePlayer(e.user));
        this.on("afk_return", e => this.updatePlayer(e.user));
    }

    private updatePlayer(player: User) {
        const existing = this.players.find((p) => p.uuid === player.uuid);
        if (existing) {
            Object.assign(existing, player);
        } else {
            this.players.push(player);
        }
    }

    private initQueueInterval() {
        this._queueInterval = setInterval(this._processQueue.bind(this), this._delay);
    }

    public say(text: string, name?: string, mode: constants.mode = this.defaultFormattingMode): Promise<Success> {
        return new Promise((resolve, reject) => {
            name = name ?? this.defaultName;

            this._queue.push({
                data: {
                    id: this._queueCounter++,
                    type: "say",
                    text: text,
                    name: name,
                    mode: mode,
                },
                resolve: resolve,
                reject: reject,
            });
        });
    }

    public tell(user: string, text: string, name?: string, mode: constants.mode = this.defaultFormattingMode): Promise<Success> {
        return new Promise((resolve, reject) => {
            name = name ?? this.defaultName;

            this._queue.push({
                data: {
                    id: this._queueCounter++,
                    type: "tell",
                    user: user,
                    text: text,
                    name: name,
                    mode: mode,
                },
                resolve: resolve,
                reject: reject,
            });
        });
    }

    public connect(callback?: (client?: Client) => void) {
        this._ws = new WebSocket(constants.endpoint + this._token);
        this._ws.on("message", this._onMessage.bind(this));

        if (callback) {
            this._ws.on("open", () => callback(this))
        }
    }

    public close() {
        clearInterval(this._queueInterval);
        if (this._ws && (this._ws.readyState === this._ws.OPEN || this._ws.readyState === this._ws.CONNECTING)) {
            this._ws.close();
        }
    }

    public reconnect(wait: boolean = false) {
        this.close();

        setTimeout(this.connect.bind(this), wait ? this.waitTimeRestart : 0);
    }

    private _onReady() {
        this.initQueueInterval();
        this.emit("ready");
    }

    private _onMessage(rawData: string) {
        const data: Data = JSON.parse(rawData);
        this.emit("raw", data);

        switch (data.type) {
            case "hello":
                let hello = data as Hello;

                this.owner = hello.licenseOwner;
                this.capabilities = hello.capabilities;

                this._onReady();
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
            case "error":
                let error = data as Error
                if (error.id && this._awaitingQueue[error.id]) {
                    let promise = this._awaitingQueue[error.id];
                    promise.reject(error);
                    delete this._awaitingQueue[error.id];
                }

                break;
            case "success":
                let success = data as Success;
                let promise = this._awaitingQueue[success.id];
                if (promise && success.reason === "message_sent") {
                    promise.resolve(success);
                    delete this._awaitingQueue[success.id];
                }

                break;

            case "closing":
                let closing = data as Closing;
                this.emit("closing", closing);
                // server is shutting down, and we need to restart the connection
                if (closing.closeReason === "server_stopping") {
                    this.reconnect(true);
                }
        }
    }

    private _handleEvent(event: BaseEvent) {
        this.emit(event.event, event)
    }

    private _processQueue() {
        const data = this._queue.shift();
        if (data) {
            this._ws?.send(JSON.stringify(data.data));
            this._awaitingQueue[data.data.id] = data;
        }
    }
}