import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface ChatboxCommand extends BaseEvent {
    user: User,
    command: string,
    args: string[],
    ownerOnly: boolean
}