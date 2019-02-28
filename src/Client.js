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

/**
 * SwitchCraft Chatbox Client
 * @class Client
 * @extends {EventEmitter}
 */
module.exports = class Client extends EventEmitter {
    /**
     * @param {String} [licenseKey] Licence key for authentication
     * @example
     * new SwitchChat.Client('licence key')
     */
    constructor(licenseKey = "guest") {
        super();

        /**
         * URL of the WebSocket server
         * @type {string} URL
         */
        this.endpoint = "wss://chat.switchcraft.pw/";
        this.license = licenseKey;
        this.players = new Map();
        this.owner = null;

        this.running = false;

        this.queueInterval = null;

        this.messageQueue = [];
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
                if (data.type === "hello") {
                    if (data.ok) {
                        this.capabilities = data.capabilities;
                        this.guest = data.guest;
                        this.owner = data.licenceOwner;

                        this.queueInterval = setInterval(() => {
                            if (this.messageQueue.length > 0) {
                                this.ws.send(this.messageQueue.shift());
                            }
                        }, 350);

                        this.running = true;
                        return resolve();
                    } else {
                        this.running = false;
                        return reject(data.reason);
                    }
                } else if (data.type === "players") {
                    this.players = new Map();
                    for (let i = 0; i < data.players.length; i++) {
                        this.players.set(data.players[i].uuid, new Player(this, data.players[i]))
                    }
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
                } else if (data.type === "closing") {
                    this.emit("closing", {
                        reason: data.reason,
                        closeReason: data.closeReason,
                    })
                }
            });

            ws.on("close", ()=>{
                if(this.running){
                    clearInterval(this.queueInterval);
                    return resolve(setTimeout(this.connect), 3000);
                }
            })

        });
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
     * @param {string} [mode] Mode prefered to display the message. "markdown" and "format"
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
};