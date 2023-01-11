import {Data} from "./Data";

export interface Closing extends Data {
    closeReason: string;
    reason: string;
}