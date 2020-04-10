/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const CONSTANTS = require("../constants");
const DiscordRole = require("./DiscordRole");

module.exports = class DiscordUser {
    constructor(client, data) {
        this.client = client;

        this.type = data.type || "discord"; // ???
        this.name = data.name;
        this.id = data.id;
        this.displayName = data.displayName || this.name;
        this.displayNameFormatted = data.displayNameFormatted || this.displayName;

        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.roles = [];
        for (let i = 0; i < data.roles.length; i++) {
            this.roles.push(new DiscordRole(this.client, data.roles[i]))
        }
    }

    get [Symbol.toStringTag]() {
        return "DiscordUser";
    }

    toString() {
        return this.name;
    }
};