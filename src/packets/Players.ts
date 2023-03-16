import {Data} from "./Data";
import {User} from "../types";

export interface Players extends Data {
    time: string;
    players: User[];
}
