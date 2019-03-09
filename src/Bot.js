const SwitchChat = require("./");

module.exports = class Bot extends SwitchChat.Client {
    constructor(license, options = {}) {
        super(license);

    }

};