import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface AFK extends BaseEvent {
    user: User
}