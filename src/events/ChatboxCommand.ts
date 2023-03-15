import {BaseEvent} from "./BaseEvent";
import {User} from "../types/User";

/** The event received when a player runs a chatbox command (public backslash commands: `\command`, private owner-only 
 * caret/pipe commands: `^command`) in-game. The `command` capability is required to receive command events. */
export interface ChatboxCommand extends BaseEvent {
    /** The in-game player who ran the command. */
    user: User;

    /** The name of the command (the word immediately following the backslash/caret/pipe, excluding the 
     * backslash/caret/pipe). */
    command: string;

    /** Array of space-separated string arguments after the command. */
    args: string[];

    /** `true` if the command is an owner-only command (`^command`). */
    ownerOnly: boolean;
}
