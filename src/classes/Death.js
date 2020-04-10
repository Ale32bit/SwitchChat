/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const CONSTANTS = require("../constants");
const Player = require("./Player");

module.exports = class Message {
    constructor(client, data) {
        this.client = client;

        this.text = data.text;
        this.renderedText = data.renderedText;
        this.time = new Date(data.time);
        this.user = new Player(this.client, data.user);

        this.name = data.name || null;
        this.rawName = data.name || null;

    }

    get [Symbol.toStringTag]() {
        return "Message";
    }

    toString() {
        return this.rawText;
    }
};