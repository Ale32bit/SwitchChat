import {BaseEvent} from "./BaseEvent";
import {RenderedTextObject} from "../types/RenderedTextObject";
import {User} from "../types/User";

export interface ChatboxChatMessage extends BaseEvent {
    text: string,
    rawText: string,
    renderedText: RenderedTextObject,
    user: User,
    name: string,
    rawName: string,
}