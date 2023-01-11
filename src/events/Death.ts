import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";
import {RenderedTextObject} from "../types/RenderedTextObject";

export interface Death extends BaseEvent {
    text: string,
    rawText: string,
    renderedText: RenderedTextObject,
    user: User,
    source: User,
}