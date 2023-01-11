import {Data} from "./Data";
import {User} from "../types/User";

export interface Players extends Data {
    time: string,
    players: User[]
}