/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const EventEmitter = require("events").EventEmitter;
const WebSocket = require("ws");
const Player = require("./structures/Player");
const ChatMessage = require("./structures/ChatMessage");
const DiscordMessage = require("./structures/DiscordMessage");
const Death = require("./structures/Death");
const Command = require("./structures/Command");
const utils = require("./utils");
const fs = require("fs");
const path = require("path");

/**
 * SwitchCraft Chatbox Client
 * @class Client
 * @extends {EventEmitter}
 */
module.exports = class Client extends EventEmitter {
    /**
     * @param {String} [licenseKey] Licence key for authentication
     * @param {Object} [options] Options
     * @example
     * new SwitchChat.Client('licence key')
     */
    constructor(licenseKey = "guest", options = {}) {
        super();

        this.options = {};
        this.options.queueInterval = options.queueInterval || 350; // 350 milliseconds
        this.options.restartOnNullOwner = options.restartOnNullOwner || true;
        this.options.playersCachePath = options.playersCachePath || path.resolve(path.dirname(module.parent.filename), "playersCache.json");

        /**
         * URL of the WebSocket server
         * @type {string} URL
         */
        this.endpoint = "wss://chat.switchcraft.pw/";
        this.license = licenseKey;
        this.players = new Map();
        this.capabilities = {};
        this.owner = null;

        this.CAPABILITIES = {
            SAY: "say",
            TELL: "tell",
            READ: "read",
            COMMAND: "command"
        };

        this.running = false;
        this.immediateRestart = false;

        this.queueInterval = null;

        this.messageQueue = [];

        this.lastID = 0;
        this.promises = {};

        if (!fs.existsSync(this.options.playersCachePath)) fs.writeFileSync(this.options.playersCachePath, "[]");

        this.playerCache = new Map(require(this.options.playersCachePath));
    }


    /**
     * Connect to the server and authenticate the licence key
     * @returns {Promise}
     * @fires Client#login
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.endpoint + this.license);
            let ws = this.ws;
            ws.on("message", data => {
                data = JSON.parse(data);
                this.emit("ws_message", data);
                if (data.type === "hello") {
                    if (data.ok) {
                        this.capabilities = data.capabilities;
                        this.guest = data.guest;
                        this.owner = data.licenceOwner;

                        this.queueInterval = setInterval(() => {
                            if (this.messageQueue.length > 0) {
                                this.ws.send(this.messageQueue.shift());
                            }
                        }, this.options.queueInterval);

                        this.running = true;

                        if (this.options.restartOnNullOwner) {
                            if (!this.owner) {
                                this.immediateRestart = true;
                                this.reconnect();
                            }
                        }

                        /**
                         * Successful login
                         *
                         * @event Client#login
                         */
                        this.emit("login");

                        return resolve();
                    } else {
                        this.running = false;
                        return reject(data.reason);
                    }
                } else if (data.type === "success") {
                    if (this.promises[data.id]) {
                        this.promises[data.id].resolve({
                            id: data.id,
                            reason: data.reason,
                            ok: true,
                        })
                    }
                } else if (data.type === "players") {
                    this.players = new Map();
                    for (let i = 0; i < data.players.length; i++) {
                        this.players.set(data.players[i].uuid, new Player(this, data.players[i]));
                        this.playerCache.set(data.players[i].uuid, {
                            name: data.players[i].name,
                            uuid: data.players[i].uuid,
                            world: data.players[i].world,
                            group: data.players[i].group,
                            displayName: data.players[i].displayName,
                            displayNameFormatted: data.displayNameFormatted,
                        });
                    }
                    fs.writeFileSync(this.options.playersCachePath, JSON.stringify([...this.playerCache]));
                    /**
                     * Players list updated
                     *
                     * @event Client#players
                     * @type {Map}
                     */
                    this.emit("players", this.players);
                } else if (data.type === "message") {
                    if (data.channel === "chat") {
                        /**
                         * Get chat message
                         *
                         * @event Client#chat
                         * @param {ChatMessage} message The chat message
                         */
                        this.emit("chat", new ChatMessage(this, data));
                    } else if (data.channel === "discord") {
                        /**
                         * Get Discord chat message
                         *
                         * @event Client#discord
                         * @param {DiscordMessage} discordMessage The Discord chat message
                         */
                        this.emit("discord", new DiscordMessage(this, data))
                    }
                } else if (data.type === "command") {
                    /**
                     * Emitted when a player runs a ChatBox command
                     *
                     * @event Client#command
                     * @param {Command} command The command parsed
                     */
                    this.emit("command", new Command(this, data))
                } else if (data.type === "event") {
                    if (data.event === "join") {
                        /**
                         * Emitted when a player joins the server
                         *
                         * @event Client#join
                         * @param {Player} player The player that joined
                         */
                        this.emit("join", new Player(this, data.user))
                    } else if (data.event === "leave") {
                        /**
                         * Emitted when a player leaves the server
                         *
                         * @event Client#leave
                         * @param {Player} player The player that left
                         */
                        this.emit("leave", new Player(this, data.user))
                    } else if (data.event === "death") {
                        /**
                         * Emitted when a player dies
                         *
                         * @event Client#death
                         * @param {Player} player The player that died
                         */
                        this.emit("death", new Death(this, data));
                    } else if (data.event === "afk") {
                        /**
                         * Emitted when a player has gone away from keyboard
                         *
                         * @event Client#afk
                         * @param {Player} player The player went AFK
                         */
                        this.emit("afk", new Player(this, data.user));
                    } else if (data.event === "afk_return") {
                        /**
                         * Emitted when a player returns from AFK
                         *
                         * @event Client#afk_return
                         * @param {Player} player The player that returned from AFK
                         */
                        this.emit("afk_return", new Player(this, data.user))
                    }
                } else if (data.type === "error") {
                    /**
                     * Emitted when the server returns an error from a request
                     *
                     * @event Client#_error
                     * @type {object}
                     * @property {string} error The error code
                     * @property {string} message The error message
                     * @property {boolean} ok Ok
                     */
                    this.emit("_error", {
                        error: data.error,
                        message: data.message,
                        id: data.id ? data.id : -1,
                        ok: data.ok,
                    });

                    if (data.id) {
                        if (this.promises[data.id]) {
                            this.promises[data.id].reject({
                                error: data.error,
                                message: data.message,
                                id: data.id,
                                ok: data.ok,
                            });
                        }
                    }
                } else if (data.type === "closing") {
                    /**
                     * Emitted when the server is closing
                     *
                     * @event Client#closing
                     * @type {object}
                     * @property {string} reason Reason code
                     * @property {string} closeReason Reason message
                     */
                    this.emit("closing", {
                        reason: data.reason,
                        closeReason: data.closeReason,
                    })
                }
            });

            ws.on("close", () => {
                if (this.running) {
                    clearInterval(this.queueInterval);
                    let reconnect = () => {
                        /**
                         * Emitted when the client is attempting to reconnect
                         *
                         * @event Client#reconnect
                         */
                        this.emit("reconnect");
                        return resolve(this.connect());
                    };
                    if (this.immediateRestart) {
                        this.immediateRestart = false;
                        setTimeout(reconnect, 1000); // 1s to prevent *dos*
                    } else {
                        setTimeout(reconnect, 3000)
                    }
                }
            });

            ws.on("error", (e) => {
                /**
                 * Emitted when the websocket fails
                 *
                 * @event Client#ws_error
                 * @param {Error} e The error
                 */
                this.emit("ws_error", e);
            })

        });
    }

    /**
     * Destroy WebSocket connection and don't connect anymore
     */
    destroy() {
        if (this.running) {
            this.running = false;
            this.ws.close();
        }
    }

    /**
     * Close and restart WebSocket connection
     */
    reconnect() {
        if (this.running) {
            this.ws.close();
        }
    }

    /**
     * Check if the client can do certain actions
     * @param {string} capability
     * @returns {boolean}
     */
    hasCapability(capability) {
        return utils.inArray(this.capabilities, capability);
    }

    _addMessage(data) {
        this.lastID++;
        data.id = this.lastID;
        if (data.promise) {
            this.promises[this.lastID] = data.promise;
            delete data.promise;
        }
        this.messageQueue.push(JSON.stringify(data));
    }

    /**
     * Say a message to all players
     * @param {string} message Content of the message
     * @param {string} [label] Label of the message
     * @param {string} [mode] Mode preferred to display the message. "markdown" and "format"
     * @example
     * client.say("Hello, world!", "SteveBot", "markdown")
     */
    say(message, label, mode = "markdown") {
        return new Promise((resolve, reject) => {
            if (this.hasCapability("say")) {
                this._addMessage({
                    type: "say",
                    text: message,
                    name: label,
                    mode: mode || "markdown",
                    promise: {
                        resolve,
                        reject,
                    }
                })
            } else {
                reject("Missing 'say' capability");
            }
        });
    }

    /**
     * Tell a message to a player
     * @param {String} player Recipient
     * @param {String} message Content of the message
     * @param {string} [label] Label of the message
     * @param {string} [mode] Mode preferred to display the message. "markdown" and "format"
     * @example
     * client.tell("Steve", "Hello, Steve!", "Herobrine", "format")
     */
    tell(player, message, label, mode = "markdown") {
        return new Promise((resolve, reject) => {
            if (this.hasCapability("tell")) {
                this._addMessage({
                    type: "tell",
                    user: player.toString(),
                    text: message,
                    name: label,
                    mode: mode || "markdown",
                    promise: {
                        resolve,
                        reject,
                    }
                })
            } else {
                reject("Missing 'tell' capability");
            }
        });
    }

    getPlayer(uuid) {
        return new Promise((resolve, reject) => {
            if (this.playerCache.has(uuid)) {
                return resolve(new Player(this, this.playerCache.get(uuid)));
            } else {
                return reject("UUID not found");
            }
        });
    }
};