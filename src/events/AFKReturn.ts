import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface AFKReturn extends BaseEvent {
    user: User
}