/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

const Player = require("./Player");
module.exports = class Command {
    constructor(client, data) {
        this.client = client;

        this.command = data.command;
        this.args = data.args;
        this.raw = data.rawText;
        this.player = new Player(client, data.user);

        this.reply = this.player.tell;
    }
};