/** 
 * Minecraft-compatible raw JSON text.
 * 
 * @see https://minecraft.wiki/w/Raw_JSON_text_format
 */
export interface RenderedTextObject {
    // TODO: This is actually optional. Text may be different content types,
    //       such as `translate` and `score`.
    text: string;

    /** A list of additional raw JSON text components to be displayed after this
     * one. */
    extra: RenderedTextObject[];

    [key: string]: any;
}

/**
 * The formatting mode to use when sending messages.
 *
 * - `markdown` - Discord-like [Markdown syntax](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-).
 *   Supports URLs, but not colours.
 * - `format` - Minecraft-like [formatting codes](https://minecraft.wiki/w/Formatting_codes) using ampersands
 *  (e.g. `&e` for yellow). Supports colours, but not URLs.
 */
export type FormattingMode = "markdown" | "format";