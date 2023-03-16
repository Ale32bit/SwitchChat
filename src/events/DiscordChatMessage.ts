import {BaseEvent} from "./BaseEvent";
import {DiscordUser, RenderedTextObject} from "../types";

/** The event received when a player posts a message in Discord. */
export interface DiscordChatMessage extends BaseEvent {
    /** The message contents, without Markdown formatting codes. */
    text: string;

    /** The message contents, with its original Markdown formatting codes. */
    rawText: string;

    /** The message contents, serialised with formatting as Minecraft JSON text. */
    renderedText: RenderedTextObject;

    /** The Discord snowflake ID of this message. */
    discordId: string;

    /** The Discord user who sent the message. */
    discordUser: DiscordUser;

    /** `true` if this event represents an edit to the original message. */
    edited: boolean;
}
