import {Data} from "./Data";

export interface Success extends Data {
    id: number;
    reason: string;
}