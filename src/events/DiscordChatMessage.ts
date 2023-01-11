import {BaseEvent} from "./BaseEvent";
import {RenderedTextObject} from "../types/RenderedTextObject";
import {DiscordUser} from "../types/DiscordUser";

export interface DiscordChatMessage extends BaseEvent {
    text: string,
    rawText: string,
    renderedText: RenderedTextObject,
    discordId: string,
    discordUser: DiscordUser,
    edited: boolean,
}