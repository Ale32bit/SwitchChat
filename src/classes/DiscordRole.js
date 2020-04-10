/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const CONSTANTS = require("../constants");

module.exports = class DiscordRole {
    constructor(client, data) {
        this.client = client;

        this.id = data.id;
        this.name = data.name;
        this.colour = data.colour;
        this.color = data.colour;
    }

    get [Symbol.toStringTag]() {
        return "DiscordRole";
    }

    toString() {
        return this.name;
    }
};