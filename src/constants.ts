export const endpoint = "wss://chat.sc3.io/v2/";

export enum error {
    invalid_json = "invalid_json",
    not_connected = "not_connected",
    missing_type = "missing_type",
    unknown_type = "unknown_type",
    unknown_error = "unknown_error",
    missing_capability = "missing_capability",
    missing_text = "missing_text",
    missing_user = "missing_user",
    unknown_user = "unknown_user",
    rate_limited = "rate_limited",
    text_too_large = "text_too_large",
    name_too_large = "name_too_large",
}