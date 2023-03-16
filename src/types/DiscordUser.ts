export interface DiscordUser {
    /** The type of user. For Discord events, this is always `discord`. */
    type: "discord";

    /** The user's Discord snowflake (ID). */
    id: string;

    /** The user's username on Discord. */
    name: string;

    /** The user's server nickname on Discord, or their username if it is not
     * set. */
    displayName: string;

    /** The user's discriminator on Discord. */
    discriminator: string;

    /** URL to the user's avatar on Discord. */
    avatar: string;

    /** Array of roles the user has on Discord. */
    roles: DiscordRole[];
}

export interface DiscordRole {
    /** The role's Discord snowflake (ID). */
    id: string;

    /** The name of the role. */
    name: string;

    /** The colour of the role, as a 24-bit integer (0xFFFFFF). */
    colour: number;
}
