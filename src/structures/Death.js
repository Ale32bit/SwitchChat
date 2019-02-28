/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const Player = require("./Player");
module.exports = class Death {
    constructor(client, data) {
        this.client = client;

        this.message = data.text;
        this.renderedMessage = data.renderedText;
        this.player = new Player(client, data.user);
    }

    toString() {
        return this.message;
    }

    get [Symbol.toStringTag]() {
        return "Death";
    }
};