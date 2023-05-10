import {BaseEvent} from "./BaseEvent";
import {User, RenderedTextObject} from "../types";

/** The event received when a player changes worlds. */
export interface WorldChange extends BaseEvent {
    /** The in-game player who changed worlds. */
    user: User;

    /**
     * The world the player has moved from. It will be a Minecraft namespaced registry key, for example:
     *
     * - `minecraft:overworld` - The overworld
     * - `minecraft:the_nether` - The Nether
     * - `minecraft:the_end` - The End
     */
    origin: string;

    /**
     * The world the player is now in. It will be a Minecraft namespaced registry key, for example:
     *
     * - `minecraft:overworld` - The overworld
     * - `minecraft:the_nether` - The Nether
     * - `minecraft:the_end` - The End
     */
    destination: string;
}
