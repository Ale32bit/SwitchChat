const DiscordUser = require("./DiscordUser");
module.exports = class DiscordMessage {
    constructor(client, data) {
        this.client = client;

        this.id = data.id;
        this.message = data.text;
        this.rawText = data.rawText;
        this.user = new DiscordUser(client, data.discordUser);
        this.edited = data.edited;
    }

    toString() {
        return this.message;
    }

    get [Symbol.toStringTag]() {
        return "ChatMessage";
    }
};