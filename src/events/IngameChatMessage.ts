import {BaseEvent} from "./BaseEvent";
import {RenderedTextObject} from "../types/RenderedTextObject";
import {User} from "../types/User";

/** The event received when a player posts a message in public chat. */
export interface IngameChatMessage extends BaseEvent {
    /** The message contents, without formatting codes. */
    text: string;

    /** The message contents, with its original formatting codes. */
    rawText: string;

    /** The message contents, serialised with formatting as Minecraft JSON text. */
    renderedText: RenderedTextObject;

    /** The in-game player who sent the message. */
    user: User;
}
