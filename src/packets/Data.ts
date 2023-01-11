import * as constants from "../constants";

export interface Data {
    ok: boolean,
    type: string,
    error: constants.error | undefined,
    message: string | undefined,
}