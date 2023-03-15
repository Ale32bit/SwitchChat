import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

/** The event received when a player joins the game. */
export interface Join extends BaseEvent {
    /** The in-game player who joined. */
    user: User;
}
