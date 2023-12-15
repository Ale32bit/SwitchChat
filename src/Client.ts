import * as events from "events";
import * as constants from "./constants";
import WebSocket from "ws";

import {Capability, FormattingMode, User} from "./types";
import {Data, Hello, Players, Success, RequestError, Closing} from "./packets";
import {
    ChatboxChatMessage, ChatboxCommand, DiscordChatMessage, IngameChatMessage, Leave, Join, Death, WorldChange,
    AFKReturn, AFK, ServerRestartCancelled, ServerRestartScheduled, BaseEvent
} from "./events";
import {QueueMessage} from "./types/QueueMessage";
import ChatboxError from "./errors/ChatboxError";

export declare interface Client {
    /**
     * Minecraft username of the owner of the chatbox license
     */
    owner: string;

    /**
     * List of capabilities this chatbox license can do. Typically, guest connections can only use `read`. Connections
     * with a license will usually have `read`, `command` and `tell`.
     */
    capabilities: Capability[];

    /**
     * List of currently online players
     */
    players: User[];

    /**
     * Endpoint of the Chatbox server. Must include `wss://` and the version route. Defaults to `wss://chat.sc3.io/v2/`.
     */
    endpoint: string;

    /**
     * Default name for chatbox messages
     */
    defaultName: string | undefined;

    /**
     * Default formatting mode for say and tell messages.
     * Defaults to "markdown"
     */
    defaultFormattingMode: FormattingMode;

    running: boolean;

    /**
     * Connect to the Chatbox server
     * @param callback Callback to run when the connection is open
     */
    connect(callback?: (client?: Client) => void): void;

    /**
     * Close the connection to the Chatbox server
     * @param soft Keep running status as is
     */
    close(soft?: boolean): void;

    /**
     * Close and reconnect to the Chatbox server
     * @param wait Whether to wait before reconnecting.
     */
    reconnect(wait?: boolean): void;

    /**
     * Sends a message to the in-game public chat.
     *
     * @param text The message to send.
     * @param name The name of the chatbox to show. If no name is specified, it will default to the username of the
     *             license owner.
     * @param mode The formatting mode to use. You can use these formatting modes:
     *   - `markdown` - Discord-like [Markdown syntax](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-).
     *      Supports URLs, but not colours.
     *   - `format` - Minecraft-like [formatting codes](https://minecraft.wiki/w/Formatting_codes) using
     *      ampersands (e.g. `&e` for yellow). Supports colours, but not URLs.
     *
     *   If no mode is specified, it will default to the mode specified in the constructor.
     *
     * @returns A {@link Success} object containing if the message was sent.
     */
    say(text: string | User, name?: string, mode?: FormattingMode): Promise<Success>;

    /**
     * Sends a private message to an in-game player.
     *
     * @param user The username or UUID of the user to send the message to.
     * @param text The message to send.
     * @param name The name of the chatbox to show. If no name is specified, it will default to the username of the
     *             license owner.
     * @param mode The formatting mode to use. You can use these formatting modes:
     *   - `markdown` - Discord-like [Markdown syntax](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-).
     *      Supports URLs, but not colours.
     *   - `format` - Minecraft-like [formatting codes](https://minecraft.wiki/w/Formatting_codes) using
     *      ampersands (e.g. `&e` for yellow). Supports colours, but not URLs.
     *
     *   If no mode is specified, it will default to the mode specified in the constructor.
     *
     * @returns A {@link Success} object containing if the message was sent.
     */
    tell(user: string | User, text: string, name?: string, mode?: FormattingMode): Promise<Success>;

    /** Emitted when the Chatbox client is ready to send and receive messages. */
    on(event: "ready", listener: () => void): this;

    on(event: "players", listener: () => void): this;

    on(event: "closing", listener: () => void): this;

    on(event: "error", listener: () => void): this;

    on(event: "raw", listener: (rawData: { [key: string]: any }) => void): this;

    on(event: "ws_error", listener: (err: RequestError) => void): this;

    // =========================================================================
    // Server events
    // =========================================================================

    /**
     * The event received when a player posts a message in public chat. The `read` capability is required to receive
     * chat events.
     * @event
     */
    on(event: "chat_ingame", listener: (message: IngameChatMessage) => void): this;

    /**
     * The event received when a player posts a message in Discord. The `read` capability is required to receive chat
     * events.
     * @event
     */
    on(event: "chat_discord", listener: (message: DiscordChatMessage) => void): this;

    /**
     * The event received when another chatbox sends a message. The `read` capability is required to receive chat
     * events.
     * @event
     */
    on(event: "chat_chatbox", listener: (message: ChatboxChatMessage) => void): this;

    /**
     * The event received when a player runs a chatbox command (public backslash commands: `\command`, private
     * owner-only caret/pipe commands: `^command`) in-game. The `command` capability is required to receive command
     * events.
     * @event
     */
    on(event: "command", listener: (command: ChatboxCommand) => void): this;

    /**
     * The event received when a player joins the game.
     * @event
     */
    on(event: "join", listener: (join: Join) => void): this;

    /**
     * The event received when a player leaves the game.
     * @event
     */
    on(event: "leave", listener: (leave: Leave) => void): this;

    /**
     * The event received when a player dies in-game.
     * @event
     */
    on(event: "death", listener: (death: Death) => void): this;

    /**
     * The event received when a player changes world.
     * @event
     */
    on(event: "world_change", listener: (worldChange: WorldChange) => void): this;

    /**
     * The event received when a player goes AFK in-game.
     * @event
     */
    on(event: "afk", listener: (afk: AFK) => void): this;

    /**
     * The event received when a player returns from being AFK in-game.
     * @event
     */
    on(event: "afk_return", listener: (afkReturn: AFKReturn) => void): this;

    /**
     * The event received when a server restart has been scheduled. At the time of `restartAt`, the server will restart
     * and the websocket will be disconnected.
     *
     * @see https://docs.sc3.io/chatbox/websocket.html#server-restart-scheduled-event
     * @event
     */
    on(event: "server_restart_scheduled", listener: (event: ServerRestartScheduled) => void): this;

    /**
     * The event received when a previously scheduled server restart has now been cancelled.
     *
     * @see https://docs.sc3.io/chatbox/websocket.html#server-restart-cancelled-event
     * @event
     */
    on(event: "server_restart_cancelled", listener: (event: ServerRestartCancelled) => void): this;
}

export class Client extends events.EventEmitter {
    owner: string = "Guest";
    capabilities: Capability[];
    players: User[] = [];
    endpoint: string = constants.endpoint;
    defaultName: string | undefined;
    defaultFormattingMode: FormattingMode = "markdown";
    waitTimeRestart: number = 60000;
    running: boolean = false;
    private _delay: number = 500;
    private readonly _queue: QueueMessage[] = [];
    private readonly _awaitingQueue: { [key: number]: QueueMessage } = {};
    private _processingQueue = false;
    private _queueCounter = 1;


    private readonly _token: string;
    private _ws?: WebSocket;

    constructor(token: string, options: {
        defaultName: string,
        defaultFormattingMode: FormattingMode,
    }) {
        super();
        this.capabilities = [];

        this._token = token;
        if (options) {
            this.defaultName ??= options.defaultName;
            this.defaultFormattingMode ??= options.defaultFormattingMode;
        }

        this.on("afk", e => this.updatePlayer(e.user));
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

    public say(text: string, name?: string, mode: FormattingMode = this.defaultFormattingMode): Promise<Success> {
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

            this._processQueue();
        });
    }

    public tell(user: string | User, text: string, name?: string, mode: FormattingMode = this.defaultFormattingMode): Promise<Success> {
        return new Promise((resolve, reject) => {
            name = name ?? this.defaultName;

            let playerUsername: string;
            if (typeof user === "string") {
                playerUsername = user as string;
            } else {
                playerUsername = (user as User).name;
            }

            this._queue.push({
                data: {
                    id: this._queueCounter++,
                    type: "tell",
                    user: playerUsername,
                    text: text,
                    name: name,
                    mode: mode,
                },
                resolve: resolve,
                reject: reject,
            });

            this._processQueue();
        });
    }

    public connect(callback?: (client?: Client) => void) {
        this._ws = new WebSocket(this.endpoint + this._token);
        this._ws.on("close", (code, reason) => {
            if (this.running) {
                this._processingQueue = false;
                this.reconnect(true);
            }
        });
        this._ws.on("error", (err) => this.emit("ws_error", err));
        this._ws.on("message", this._onMessage.bind(this));

        if (callback) {
            this._ws.on("open", () => callback(this))
        }
    }

    public close(soft?: boolean) {
        if (!soft) {
            this.running = false;
        }
        this._processingQueue = false;
        if (this._ws && (this._ws.readyState === this._ws.OPEN || this._ws.readyState === this._ws.CONNECTING)) {
            this._ws.close();
        }
    }

    public reconnect(wait: boolean = false) {
        this.close(true);

        setTimeout(this.connect.bind(this), wait ? this.waitTimeRestart : 0);
    }

    private _onReady() {
        this._processQueue();
        this.emit("ready");
    }

    private _onMessage(rawData: string) {
        const data: Data = JSON.parse(rawData);
        this.emit("raw", data);

        switch (data.type) {
            case "hello":
                let hello = data as Hello;

                this.running = true;

                this.owner = hello.licenseOwner;
                this.capabilities = hello.capabilities as Capability[];

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

                if (event.type === "server_restart_scheduled") {
                    const restart = event as ServerRestartScheduled;
                    restart.restartAt = new Date(restart.restartAt);
                }

                this._handleEvent(event);
                break;

            case "error":
                let error = data as RequestError
                if (error.id && this._awaitingQueue[error.id]) {
                    let promise = this._awaitingQueue[error.id];
                    let chatboxError = new ChatboxError(error.message, error.error, error.id);
                    promise.reject(chatboxError);
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
                this._processingQueue = false;
                // server is shutting down, and we need to restart the connection
                if (closing.closeReason !== "server_stopping") {
                    this.running = false;
                }
        }
    }

    private _handleEvent(event: BaseEvent) {
        this.emit(event.event, event);
    }

    private async _processQueue() {
        if (this._processingQueue)
            return;

        this._processingQueue = true;
        while (this._processingQueue) {
            const data = this._queue.shift();
            if (data) {
                this._ws?.send(JSON.stringify(data.data));
                this._awaitingQueue[data.data.id] = data;

                await this._sleep(this._delay);
            } else {
                break;
            }
        }
        this._processingQueue = false;
    }

    private _sleep(ms?: number | undefined) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }
}
