/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const DiscordRole = require("./DiscordRole");
module.exports = class DiscordUser {
    constructor(client, data) {
        this.client = client;

        this.id = data.id;
        this.name = data.name;
        this.displayName = data.displayName;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.roles = new Map();

        for(let i = 0; i<data.roles.length; i++){
            this.roles.set(data.roles[i].id, new DiscordRole(client, data.roles[i]));
        }
    }

    get username() {
        return this.name + "#" + this.discriminator;
    }

    toString() {
        return `${this.name}#${this.discriminator}`;
    }

    get [Symbol.toStringTag]() {
        return "DiscordUser";
    }
};