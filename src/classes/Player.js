/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const CONSTANTS = require("../constants");

module.exports = class Player {
    constructor(client, data) {
        this.client = client;

        this.type = data.type || "ingame"; // ???
        this.name = data.name;
        this.uuid = data.uuid;
        this.displayName = data.displayName || this.name;
        this.displayNameFormatted = data.displayNameFormatted || this.displayName;
        this.world = data.world;
        this.group = data.group || "default";
    }

    get [Symbol.toStringTag]() {
        return "Player";
    }

    /**
     * Tell a message to a player
     * @param text {string} Message
     * @param [name] {string} ChatBox name
     * @param [prefix] {string} ChatBox prefix
     * @param [mode=markdown] {string}
     * @example
     * player.tell("Hello, world!", "SteveBot", "markdown")
     */
    tell(text, name, prefix, mode = CONSTANTS.MODES.MARKDOWN) {
        return this.client.tell(this.name, text, name, prefix, mode)
    }

    toString() {
        return this.name;
    }
};