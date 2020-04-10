/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const CONSTANTS = require("../constants");
const DiscordUser = require("./DiscordUser");

module.exports = class DiscordMessage {
    constructor(client, data) {
        this.client = client;

        this.id = data.discordID;
        this.discordID = this.id;

        this.text = data.text;
        this.rawText = data.rawText;
        this.renderedText = data.renderedText;
        this.channel = data.channel;
        this.time = new Date(data.time);
        this.edited = data.edited;
        this.user = new DiscordUser(this.client, data.user)
    }

    get [Symbol.toStringTag]() {
        return "DiscordMessage";
    }

    toString() {
        return this.rawText;
    }
};