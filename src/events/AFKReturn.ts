import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface AFKReturn extends BaseEvent {
    /** The in-game player who returned from being AFK. */
    user: User;
}
