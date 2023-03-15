import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

export interface AFK extends BaseEvent {
    /** The in-game player who went AFK. */
    user: User;
}
