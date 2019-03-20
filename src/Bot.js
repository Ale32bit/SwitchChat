const Client = require("./Client");
const BotCommand = require("./structures/BotCommand");
const fs = require("fs");
const path = require("path");

module.exports = class Bot extends Client {
    /**
     * @param {String} [license] Licence key for authentication
     * @param {Object} [options] Options
     * @example
     * new SwitchChat.Bot('licence key')
     */
    constructor(license, options = {}) {
        super(license, options);

        console.warn("Experimental SwitchChat Modular Bot Engine");

        let baseDir = path.dirname(module.parent.filename);
        this.plugins = new Map();

        this.options.command = options.command || "bot";
        this.options.pluginsPath = options.pluginsPath || path.resolve(baseDir, "sc_plugins");
        this.options.configPath = options.configPath || path.resolve(baseDir, "sc_configs");

        if (!fs.existsSync(this.options.pluginsPath)) {
            fs.mkdirSync(this.options.pluginsPath);
            console.log(`Plugins directory path created at ${this.options.pluginsPath}`)
        }

        if (!fs.existsSync(this.options.configPath)) {
            fs.mkdirSync(this.options.configPath);
            console.log(`Plugins config directory path created at ${this.options.configPath}`)
        }

        // load plugins
        fs.readdirSync(this.options.pluginsPath).forEach(pluginFile => {
            try {
                let plugin = new (require(path.resolve(this.options.pluginsPath, pluginFile)))(this);

                this.plugins.set(plugin.id, plugin);
            } catch (e) {
                console.error(e);
            }
        });

        this.on("command", async cmd => {
            if (cmd.command === this.options.command) {
                let args = cmd.args;
                let commandName = args.shift();

                let botCommand = new BotCommand(this, {
                    command: commandName,
                    args: args,
                    rawCommand: cmd,
                    player: cmd.player,
                });

                let execute = true;
                let ev = {
                    preventDefault() {
                        execute = false;
                    }
                };

                this.emitPlugins("command", ev, botCommand);

                let command = await this.getCommand(commandName);
                if (command) {
                    if (execute) {
                        try {
                            await command.callback(botCommand);
                            this.emitPlugins("command_success", botCommand);
                        } catch (e) {
                            this.emitPlugins("command_error", botCommand, e)
                        }
                    } else {
                        this.emitPlugins("command_killed", botCommand);
                    }
                } else {
                    this.emitPlugins("command_unknown", botCommand);
                }
            }
        })
    }

    /**
     * Get command from name
     * @param {String} commandName Command name
     * @returns {Promise<Object>}
     */
    getCommand(commandName) {
        return new Promise(async (resolve) => {
            let mtc = commandName.match(/^\w+:/);
            let id;
            if (mtc) id = mtc[0].substring(0, mtc[0].length - 1);
            if (id) {
                let cmdm = commandName.match(/:\w+/);
                let cmd = cmdm[0].substring(1);
                let plugin = await this.getPluginByCommandId(id);
                if (plugin) return resolve(plugin.commands[cmd]);
            } else {
                this.plugins.forEach((v) => {
                    for (let cmdName in v.commands) {
                        if (cmdName === commandName) {
                            return resolve(v.commands[cmdName]);
                        }
                    }
                });
                return resolve();
            }
        });
    }

    /**
     * Check existence of a command
     * @param {String} commandName Command name
     * @returns {Promise<boolean>}
     */
    async hasCommand(commandName) {
        this.plugins.forEach((v) => {
            for (let cmdName in v.commands) {
                if (cmdName === commandName) {
                    return true;
                }
            }
        });
        return false;
    }

    /**
     * Get a plugin by its command ID
     * @param {String} commandId Command ID
     * @returns {Promise<Plugin>}
     */
    getPluginByCommandId(commandId) {
        return new Promise(resolve => {
            this.plugins.forEach((v) => {
                if (v.commandId === commandId) return resolve(v);
            });
        });
    }

    emitPlugins(event, ...args) {
        this.plugins.forEach((v) => {
            args.unshift(event);
            v.emit.apply(v, args);
        });
    }
};