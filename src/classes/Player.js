/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

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
     * @param {string} message Content of the message
     * @param {string} [label] Label of the message
     * @param {string} [mode] Mode preferred to display the message. "markdown" and "format"
     * @example
     * player.tell("Hello, world!", "SteveBot", "markdown")
     */
    tell(message, label, mode = CONSTANTS.MODES.MARKDOWN) {
        return new Promise((resolve, reject) => {
            this.client._queueMessage({
                type: "tell",
                user: this.toString(),
                text: message,
                name: label,
                mode: mode,
                promise: {
                    resolve,
                    reject,
                }
            })

        });
    }

    toString() {
        return this.name;
    }
};