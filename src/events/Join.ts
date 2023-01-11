import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface Join extends BaseEvent {
    user: User
}