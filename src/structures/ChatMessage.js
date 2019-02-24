const Player = require("./Player");
module.exports = class ChatMessage {
    constructor(client, data) {
        this.client = client;

        this.message = data.text;
        this.rawMessage = data.rawText;
        this.renderedMessage = data.renderedText;
        this.player = new Player(client, data.user);
    }

    toString() {
        return this.message;
    }

    get [Symbol.toStringTag]() {
        return "ChatMessage";
    }

};