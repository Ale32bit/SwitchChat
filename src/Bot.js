const Client = require("./Client");
const BotCommand = require("./structures/BotCommand");
const fs = require("fs");
const path = require("path");

module.exports = class Bot extends Client {
    constructor(license, options = {}) {
        super(license);

        console.warn("Experimental SwitchChat Modular Bot Engine");

        let baseDir = path.dirname(module.parent.filename);
        this.plugins = new Map();

        this.options = {};
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

    getCommand(commandName) {
        return new Promise((resolve) => {
            this.plugins.forEach((v) => {
                for (let cmdName in v.commands) {
                    if (cmdName === commandName) {
                        return resolve(v.commands[cmdName]);
                    }
                }
            });
            return resolve();
        });
    }

    emitPlugins(event, ...args) {
        this.plugins.forEach((v) => {
            args.unshift(event);
            v.emit.apply(v, args);
        });
    }
};