import {BaseEvent} from "./BaseEvent";

export interface ServerRestartScheduled extends BaseEvent {
    /** The type of restart. Will be `automatic` or `manual`. */
    restartType: "automatic" | "manual";

    /** The number of seconds specified until the server restart. */
    restartSeconds: number;

    /** The time that the server will restart. */
    restartAt: Date;
    
    /** The time that this restart was scheduled. */
    time: Date;
}
