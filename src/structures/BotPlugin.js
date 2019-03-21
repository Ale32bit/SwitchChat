const {EventEmitter} = require("events");
const path = require("path");

let idRegex = /^[\w.\-]+$/i;
let commandIdRegex = /[^.]+$/i;

/**
 * Plugin
 * @type {module.Plugin}
 * @extends {EventEmitter}
 */
module.exports = class Plugin extends EventEmitter {
    /**
     * @param {Object} client Client
     * @param {String} id Plugin full ID
     * @param {Object} [details]
     */
    constructor(client, id, details = {}) {
        super();
        if (!idRegex.test(id)) {
            throw new Error("Invalid Plugin ID");
        }
        this.id = id;
        this.commandId = id.match(commandIdRegex)[0];
        this.client = client;
        this.details = details;
        this.commands = {};
    }

    /**
     * Add a new command to the plugin
     * @param {String} commandName Command Name
     * @param {Function} callback Command Callback
     * @param {Object} [info] Information
     */
    addCommand(commandName, callback, info = {}) {
        this.commands[commandName] = {
            callback,
            info,
        }
    }

    /**
     * Get command
     * @param {String} commandName Command name
     * @returns {Object|undefined} Command
     */
    getCommand(commandName) {
        return this.commands[commandName] || undefined
    }

    /**
     * Get all plugin commands
     * @returns {Object} Commands
     */
    get getCommands() {
        return this.commands;
    }

    /**
     * Check if plugin has a command
     * @param {String} commandName Command name
     * @returns {boolean}
     */
    hasCommand(commandName) {
        return !!this.commands[commandName];
    }

    /**
     * Get Plugin config path
     * @returns {string} Plugin Config Path
     */
    get getConfigPath() {
        return path.resolve(this.client.options.configPath, this.id);
    }

};