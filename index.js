/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

module.exports = {
    Client: require("./src/Client"),
    ChatMessage: require("./src/structures/ChatMessage"),
    Command: require("./src/structures/Command"),
    Death: require("./src/structures/Death"),
    DiscordMessage: require("./src/structures/DiscordMessage"),
    DiscordUser: require("./src/structures/DiscordUser"),
    DiscordRole: require("./src/structures/DiscordRole"),
    Player: require("./src/structures/Player"),

    Bot: require("./src/Bot"),
    BotPlugin: require("./src/structures/BotPlugin"),
    BotCommand: require("./src/structures/BotCommand"),

    utils: require("./src/utils"),
};