import {BaseEvent} from "./BaseEvent";
import {RenderedTextObject} from "../types/RenderedTextObject";
import {User} from "../types/User";

export interface IngameChatMessage extends BaseEvent {
    text: string,
    rawText: string,
    renderedText: RenderedTextObject,
    user: User,
}