import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";
import {RenderedTextObject} from "../types/RenderedTextObject";

/** The event received when a player dies in-game. */
export interface Death extends BaseEvent {
    /** The death message contents, without formatting codes. */
    text: string;

    /** The death message contents, with its original formatting codes. */
    rawText: string;

    /** The death message contents, serialised with formatting as Minecraft JSON text. */
    renderedText: RenderedTextObject;

    /** The in-game player who died. */
    user: User;

    /** The player that killed this player (if available), or `null`. */
    source: User | null;
}
