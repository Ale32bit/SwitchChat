const {EventEmitter} = require("events");

let idRegex = /^[\w.\-]+$/i;

/**
 * Plugin
 * @type {module.Plugin}
 * @extends {EventEmitter}
 */
module.exports = class Plugin extends EventEmitter {
    /**
     * @param {Object} client Client
     * @param {String} id
     * @param {Object} [details]
     */
    constructor(client, id, details = {}) {
        super();
        if (!idRegex.test(id)) {
            throw new Error("Invalid Plugin ID");
        }
        this.id = id;
        this.client = client;
        this.details = details;
        this.commands = {};
    }

    addCommand(commandName, callback, info = {}) {
        this.commands[commandName] = {
            callback,
            info,
        }
    }

    getCommand(commandName) {
        return this.commands[commandName] || undefined
    }

    get getCommands() {
        return this.commands;
    }

};