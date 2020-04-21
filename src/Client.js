/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

/**
 * @module {Class} SwitchChat Client
 */

const {EventEmitter} = require("events");
const WebSocket = require("ws");
const CONSTANT = require("./constants");
const Player = require("./classes/Player");
const Message = require("./classes/Message");
const DiscordMessage = require("./classes/DiscordMessage");
const Command = require("./classes/Command");
const Death = require("./classes/Death");

/**
 * SwitchChat Client Class
 * @class Client
 * @extends EventEmitter
 */
class Client extends EventEmitter {
    /**
     * @constructor
     * @param {String} licenceKey
     * @param {Object} [options] Options
     * @example
     * new SwitchChat.Client('licence key')
     */
    constructor(licenceKey = "guest", options = {}) {
        super();

        this.licence = licenceKey;

        this.options = {};

        // WARNING: Increase delay to allow multiple messages, 500 ms is recommended for max 20 messages at a time; 350ms for ~12 messages
        this.options.queueDelay = options.queueDelay || 500; // Delay in ms between messages to avoid losses.

        this.options.endpoint = options.endpoint || CONSTANT.ENDPOINT; // WebSocket endpoint
        this.options.autoReconnect = options.autoReconnect || true; // Reconnect websocket automatically when the server restarts
        this.options.reconnectDelay = options.reconnectDelay || 1000; // Time to wait in ms before attempting to reconnect to the server, defaults to 1 second

        this.players = new Map();
        this.licenceOwner = null;
        this.guest = true;
        this.capabilities = [];

        this.running = false;
        this._messageQueue = [];
        this._promises = {};

        this._lastID = 0;
        this._queueInterval = null;

    }

    get owner() {
        return this.licenceOwner;
    }

    /**
     * @fires Client#ready
     * @returns {Promise}
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.options.endpoint + this.licence);
            let ws = this.ws;

            ws.on("message", this._onMessage.bind(this));
            ws.on("close", (code, reason) => {
                if (this.running) {
                    clearInterval(this._queueInterval);

                    let reconnect = () => {
                        this.emit("reconnect");
                        return this.connect();
                    };

                    setTimeout(reconnect, this.options.reconnectDelay);
                }
            });
            this.once("ready", resolve);
        })
    }

    _onMessage(message) {
        let data = JSON.parse(message);
        this.emit("raw", data);

        if (data.type === "hello") { // Login event
            if (data.ok) {
                this.capabilities = data.capabilities;
                this.guest = data.guest;
                this.licenceOwner = this.guest ? null : data.licenceOwner;

                this._queueInterval = setInterval(() => {
                    if (this._messageQueue[0]) {
                        this.ws.send(this._messageQueue.shift());
                    }
                }, this.options.queueDelay);

                this.running = true;

                /**
                 * Client is connected and ready
                 *
                 * @event Client#ready
                 */
                this.emit("ready");
            } else {
                this.running = false;
                /**
                 * Client couldn't connect correctly or failed licence authentication
                 *
                 * @event Client#error
                 */
                this.emit("error", data.reason);
            }
        } else if (data.type === "success") { // resolve .tell and .say promises
            if (this._promises[data.id]) {
                if (!this._promises[data.id].on || this._promises[data.id].on !== data.reason) return;
                this._promises[data.id].resolve({
                    id: data.id,
                    reason: data.reason,
                    ok: true,
                });
                delete this._promises[data.id];
            }
        } else if (data.type === "error") { // reject .tell and .say promises
            if (this._promises[data.id]) {
                this._promises[data.id].reject({
                    id: data.id,
                    error: data.error,
                    message: data.message,
                    ok: false,
                });
                delete this._promises[data.id];
            }
        } else if (data.type === "players") {
            this.players.clear();

            for (let i = 0; i < data.players.length; i++) {
                let player = new Player(this, data.players[i]);
                this.players.set(player.uuid, player);
            }

            /**
             * Up to date map of online players
             *
             * @event Client#players
             * @type {Map}
             *
             */
            this.emit("players", this.players);
        } else if (data.type === "message") {
            if (data.channel === "chat") {

                /**
                 * An in-game player has sent a chat message
                 *
                 * @event Client#chat
                 * @type {Class}
                 */
                this.emit("chat", new Message(this, data))
            } else if (data.channel === "me") {

                /**
                 * An in-game player has sent a "me" message
                 *
                 * @event Client#chat_me
                 */
                this.emit("chat_me", new Message(this, data))
            } else if (data.channel === "chatbox") {

                /**
                 * A chatbox has sent a public message in chat
                 *
                 * @event Client#chat_chatbox
                 */
                this.emit("chat_chatbox", new Message(this, data))
            } else if (data.channel === "discord") {

                /**
                 * A Discord user has sent a message
                 *
                 * @event Client#chat_discord
                 */
                this.emit("chat_discord", new DiscordMessage(this, data))
            }
        } else if (data.type === "command") {

            /**
             * An in-game player has sent a command
             *
             * @event Client#command
             */
            this.emit("command", new Command(this, data))
        } else if (data.type === "event") {
            if (data.event === "join") {

                /**
                 * A player has joined the server
                 *
                 * @event Client#join
                 */
                this.emit("join", new Player(this, data.user))
            } else if (data.event === "leave") {

                /**
                 * A player has left the server
                 *
                 * @event Client#leave
                 */
                this.emit("leave", new Player(this, data.user))
            } else if (data.event === "death") {

                /**
                 * An in-game player has died
                 *
                 * @event Client#death
                 */
                this.emit("death", new Death(this, data))
            } else if (data.event === "afk") {

                /**
                 * An in-game player has gone AFK
                 *
                 * @event Client#afk
                 */
                this.emit("afk", new Player(this, data.user))
            } else if (data.event === "afk_return") {

                /**
                 * An in-game player has returned from AFK
                 *
                 * @event Client#afk_return
                 */
                this.emit("afk_return", new Player(this, data.user)) // i can't seem to get this event emitted, server isn't sending any data
            }
        }
    }

    // Standard functions

    _queueMessage(data = {}) {

        data.id = this._lastID;
        if (data.promise) {
            this._promises[this._lastID] = data.promise;
            delete data.promise;
        }

        this._messageQueue.push(JSON.stringify(data));

        this._lastID++;
    }

    /**
     * Say a message in chat
     *
     * @param text {string} Message
     * @param [name] {string} ChatBox name
     * @param [prefix] {string} ChatBox prefix
     * @param [mode=markdown] {string}
     * @returns {Promise<unknown>}
     */
    say(text, name, prefix, mode = CONSTANT.MODES.MARKDOWN) {
        return new Promise((resolve, reject) => {
            this._queueMessage({
                type: "say",
                text: text,
                name: name,
                prefix: prefix,
                mode: mode,

                promise: {resolve, reject, on: "messageSent"}, // internal usage
            });
        });
    }

    /**
     * Tell a message to a player
     *
     * @param user {string} Player
     * @param text {string} Message
     * @param [name] {string} ChatBox name
     * @param [prefix] {string} ChatBox prefix
     * @param [mode=markdown] {string}
     * @returns {Promise<unknown>}
     */
    tell(user, text, name, prefix, mode = CONSTANT.MODES.MARKDOWN) {
        return new Promise((resolve, reject) => {
            this._queueMessage({
                type: "tell",
                user: user,
                text: text,
                name: name,
                prefix: prefix,
                mode: mode,

                promise: {resolve, reject, on: "messageSent"}, // internal usage
            })
        });
    }

    getPlayers() {
        return this.players.values();
    }

    getPlayerList() {
        let players = [];
        this.players.forEach(((value) => {
            players.push(value);
        }));
        return players;
    }

    hasCapability(capability) {
        for (let i = 0; i < this.capabilities.length; i++) {
            if (capability === this.capabilities[i]) return true;
        }
        return false;
    }

    // extra methods

    getLicenceOwner() {
        return this.licenceOwner;
    }

    isConnected() {
        return this.running;
    }

    isGuest() {
        return this.guest
    }

    reconnect() {
        if (this.running) {
            this.ws.close();
        }
    }

    destroy() {
        if (this.running) {
            this.running = false;
            this.ws.close();
        }
    }

}

module.exports = Client;