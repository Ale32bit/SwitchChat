import {BaseEvent} from "./BaseEvent";

export interface ServerRestartCancelled extends BaseEvent {
    /** The type of restart. Will be `automatic` or `manual`. */
    restartType: "automatic" | "manual";
    
    /** The time that this restart was cancelled. */
    time: Date;
}
