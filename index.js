/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

module.exports = {
    Client: require("./src/Client"),

    Command: require("./src/classes/Command"),
    Death: require("./src/classes/Death"),
    DiscordMessage: require("./src/classes/DiscordMessage"),
    DiscordUser: require("./src/classes/DiscordUser"),
    DiscordRole: require("./src/classes/DiscordRole"),
    Message: require("./src/classes/Message"),
    Player: require("./src/classes/Player"),

    constants: require("./src/constants"),
};