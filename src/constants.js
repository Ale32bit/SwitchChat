/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2020 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

module.exports = {
    ENDPOINT: "wss://chat.switchcraft.pw/",
    CLOSE_REASONS: {
        SERVER_STOPPING: 4000,
        EXTERNAL_GUESTS_NOT_ALLOWED: 4001,
        UNKNOWN_LICENCE_KEY: 4002,
        INVALID_LICENCE_KEY: 4003,
        DISABLED_LICENCE_KEY: 4004,
        CHANGED_LICENCE_KEY: 4005,
    },
    MODES: {
        MARKDOWN: "markdown",
        FORMAT: "format",
    }
};