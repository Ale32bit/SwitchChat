module.exports = class DiscordUser {
    constructor(client, user = {}) {
        this.client = client;

        this.id = user.id;
        this.name = user.name;
        this.displayName = user.displayName;
        this.discriminator = user.discriminator;
        this.avatar = user.avatar;
        this.roles = user.roles;
    }

    get username() {
        return this.name + "#" + this.discriminator;
    }

    toString() {
        return `${this.name}#${this.discriminator}`;
    }

    get [Symbol.toStringTag]() {
        return "DiscordUser";
    }
};