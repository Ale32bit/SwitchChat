import {Success} from "../packets";
import {Error} from "../packets";
import {FormattingMode} from "./RenderedTextObject";

/** @internal */
export interface QueueMessage {
    data: {
        id: number;
        type: string;
        user?: string;
        name: string | undefined;
        text: string;
        mode: FormattingMode;
    };
    resolve: (value: Success) => void;
    reject: (reason: Error) => void;
}
