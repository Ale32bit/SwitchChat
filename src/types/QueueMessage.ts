import * as constants from "../constants";
import {Success} from "../packets/Success";
import {Error} from "../packets/Error";

/** @internal */
export interface QueueMessage {
    data: {
        id: number;
        type: string;
        user?: string;
        name: string | undefined;
        text: string;
        mode: constants.mode;
    };
    resolve: (value: Success) => void;
    reject: (reason: Error) => void;
}
