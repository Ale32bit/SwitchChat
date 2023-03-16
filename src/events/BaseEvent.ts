import {Data} from "../packets";

export interface BaseEvent extends Data {
    id: number;
    event: string;
    time: Date;
}
