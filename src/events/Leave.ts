import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface Leave extends BaseEvent {
    user: User
}