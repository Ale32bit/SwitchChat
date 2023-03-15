import {Data} from "./Data";

/** 
 * Sent by the server when an error occurs.
 * 
 * @see https://docs.sc3.io/chatbox/websocket.html#error-packet
 */
export interface Error extends Data {
    id: number | undefined;

    /** The type of error that occurred. */
    error: string;

    /** A human-readable message describing the error. */
    message: string;
}
