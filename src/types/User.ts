export interface User {
    /** The type of user. For in-game events, this is always `ingame`. */
    type: "ingame";

    /** The rank of the player. Usually `default`, `moderator`, or `admin`, but 
     * the server may send anything. */
    group: "default" | "moderator" | "admin" | string;

    /** 
     * The world the player is in, or `null` if this information is not 
     * available. It will be a Minecraft namespaced registry key, for example:
     * 
     * - `minecraft:overworld` - The overworld
     * - `minecraft:the_nether` - The nether
     * - `minecraft:the_end` - The end
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
}
