export interface User {
    /** The type of user. For in-game events, this is always `ingame`. */
    type: "ingame";

    /** The rank of the player. Usually `default`, `moderator`, or `admin`, but 
     * the server may send anything. */
    group: "default" | "moderator" | "admin" | string;

    /**
     * The [pronouns](https://docs.sc3.io/faq/pronouns.html) set by the user by running `/pronouns`. This may be `null`
     * if the player has not set any preferred pronouns. Where reasonably possible, you should attempt to use the user's
     * preferred pronouns, or avoid using pronouns entirely. If you are unable to do this, you should use the player's
     * name instead.
     *
     * @example "she/her"
     */
    pronouns: string | null;

    /** 
     * The world the player is in, or `null` if this information is not 
     * available. It will be a Minecraft namespaced registry key, for example:
     * 
     * - `minecraft:overworld` - The overworld
     * - `minecraft:the_nether` - The Nether
     * - `minecraft:the_end` - The End
     */
    world: string | null;

    /** The UUID of the player, including hyphens. */
    uuid: string;

    /** The player's name as it appears in chat. May differ from `name`. */
    displayName: string;

    /** The player's Minecraft username. */
    name: string;

    /** Whether the player is currently AFK. */
    afk?: boolean;

    /** Whether the player is an alt account. */
    alt: boolean;

    /** Whether the player is a bot account. */
    bot: boolean;

    /**
     * The current public tier of the player's supporter status. This will be `0` if the player is not a supporter or
     * has opted out of showing their supporter tag, `1` for a Tier 1 supporter, `2` for a Tier 2 supporter, and `3` for
     * a Tier 3 supporter.
     */
    supporter: number;
}
