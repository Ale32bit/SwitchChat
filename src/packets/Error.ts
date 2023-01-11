import {Data} from "./Data";

export interface Error extends Data {
    id: number | undefined;
    error: string;
    message: string;
}