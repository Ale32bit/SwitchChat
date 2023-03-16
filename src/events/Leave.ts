import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

/** The event received when a player leaves the game. */
export interface Leave extends BaseEvent {
    /** The in-game player who left. */
    user: User;
}
