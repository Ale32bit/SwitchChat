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