/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const CONSTANTS = require("../constants");
const Player = require("./Player");

module.exports = class Command {
    constructor(client, data) {
        this.client = client;

        this.command = data.command;
        this.args = data.args;
        this.rawText = data.rawText;
        this.time = new Date(data.time);

        this.user = new Player(this.client, data.user)
    }


    /**
     * Reply to the user
     * @param text {string} Message
     * @param [name] {string} ChatBox name
     * @param [prefix] {string} ChatBox prefix
     * @param [mode=markdown] {string}
     * @example
     * command.reply("Hello, world!", "SteveBot")
     */
    reply(text, name, prefix, mode = CONSTANTS.MODES.MARKDOWN) {
        return this.client.tell(this.user.name, text, name, prefix, mode)
    }

    get [Symbol.toStringTag]() {
        return "Command";
    }

    toString() {
        return this.rawText;
    }
};