import {Data} from "./Data";

/** Sent by the server when a message is sent or queued successfully. */
export interface Success extends Data {
    id: number;

    /** More information about the success. When sending messages, this may be
     * `message_sent` or `message_queued`. */
    reason: string;
}
