/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

module.exports = class DiscordRole {
    constructor(client, data) {
        this.client = client;

        this.name = data.name;
        this.id = data.id;
        this.color = data.colour;
        this.colour = data.colour; // For our british friends
    }

    toString() {
        return this.name;
    }

    get [Symbol.toStringTag]() {
        return "DiscordRole";
    }
};