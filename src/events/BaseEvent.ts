import {Data} from "../packets/Data";

export interface BaseEvent extends Data {
    id: number;
    event: string;
    time: Date;
}
