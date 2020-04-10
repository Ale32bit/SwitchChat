/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

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

    reply(text, name, prefix, mode = CONSTANTS.MODES.MARKDOWN) {
        return this.client.tell(text, this.user.name, name, prefix, mode)
    }

    get [Symbol.toStringTag]() {
        return "Command";
    }

    toString() {
        return this.rawText;
    }
};