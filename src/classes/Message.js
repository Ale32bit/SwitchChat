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
        this.rawText = data.rawText;
        this.renderedText = data.renderedText;
        this.channel = data.channel;
        this.time = new Date(data.time);
        this.edited = data.edited;
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