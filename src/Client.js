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
        this.options.restartOnTellError = options.restartOnTellError || true;
        this.options.playersCachePath = options.playersCachePath || path.resolve(path.dirname(module.parent.filename), "playersCache.json");

        /**
         * URL of the WebSocket server
         * @type {string} URL
         */
        this.endpoint = "wss://chat.switchcraft.pw/";
        this.license = licenseKey;
        this.players = new Map();
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

        if (!fs.existsSync(this.options.playersCachePath)) fs.writeFileSync(this.options.playersCachePath, "[]");

        this.playerCache = new Map(require(this.options.playersCachePath));
    }


    /**
     * Connect to the server and authenticate the licence key
     * @returns {Promise}
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

                        if (this.options.restartOnTellError) {
                            if (this.hasCapability("tell")) {
                                this._addMessage(JSON.stringify({
                                    type: "tell",
                                    user: "SC_TELL_CHECK_" + (Math.random().toString(36)),
                                    text: "Powered by SwitchChat by Ale32bit",
                                }))
                            }
                        }

                        this.emit("login");

                        return resolve();
                    } else {
                        this.running = false;
                        return reject(data.reason);
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
                    this.emit("players", this.players);
                } else if (data.type === "message") {
                    if (data.channel === "chat") {
                        this.emit("chat", new ChatMessage(this, data));
                    } else if (data.channel === "discord") {
                        this.emit("discord", new DiscordMessage(this, data))
                    }
                } else if (data.type === "command") {
                    this.emit("command", new Command(this, data))
                } else if (data.type === "event") {
                    if (data.event === "join") {
                        this.emit("join", new Player(this, data.user))
                    } else if (data.event === "leave") {
                        this.emit("leave", new Player(this, data.user))
                    } else if (data.event === "death") {
                        this.emit("death", new Death(this, data));
                    } else if (data.event === "afk") {
                        this.emit("afk", new Player(this, data.user))
                    } else if (data.event === "afk_return") {
                        this.emit("afk_return", new Player(this, data.user))
                    }
                } else if (data.type === "error") {
                    this.emit("_error", {
                        error: data.error,
                        message: data.message,
                        ok: data.ok,
                    });
                    if (this.options.restartOnTellError) {
                        if (data.error === "unknownError") {
                            this.immediateRestart = true;
                            this.ws.close();
                        }
                    }
                } else if (data.type === "closing") {
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
                        this.emit("reconnect");
                        return resolve(this.connect());
                    };
                    if (this.immediateRestart) {
                        this.immediateRestart = false;
                        setImmediate(reconnect);
                    } else {
                        setTimeout(reconnect, 3000)
                    }
                }
            });

            ws.on("error", function (e) {
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
        this.messageQueue.push(data);
    }

    /**
     * Say a message to all players
     * @param {string} message Content of the message
     * @param {string} [label] Label of the message
     * @param {string} [mode] Mode preferred to display the message. "markdown" and "format"
     * @example
     * client.say("Hello, world!", "SteveBot", "markdown")
     */
    async say(message, label, mode = "markdown") {
        if (this.hasCapability("say")) {
            this._addMessage(JSON.stringify({
                type: "say",
                text: message,
                name: label,
                mode: mode || "markdown",
            }))
        } else {
            throw "Missing 'say' capability";
        }
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
    async tell(player, message, label, mode = "markdown") {
        if (this.hasCapability("tell")) {
            this._addMessage(JSON.stringify({
                type: "tell",
                user: player.toString(),
                text: message,
                name: label,
                mode: mode || "markdown",
            }))
        } else {
            throw "Missing 'tell' capability";
        }
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