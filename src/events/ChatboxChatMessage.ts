import {BaseEvent} from "./BaseEvent";
import {User, RenderedTextObject} from "../types";

/** The event received when another chatbox sends a message. */
export interface ChatboxChatMessage extends BaseEvent {
    /** The message contents, without formatting codes. */
    text: string;

    /** The message contents, with its original formatting codes. */
    rawText: string;

    /** The message contents, serialised with formatting as Minecraft JSON text. */
    renderedText: RenderedTextObject;

    /** The owner of the chatbox that sent the message.  */
    user: User;

    /** The name of the chatbox, without formatting codes. */
    name: string;

    /** The name of the chatbox, with its original formatting codes. */
    rawName: string;
}
