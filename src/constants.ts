export const endpoint = "wss://chat.sc3.io/v2/";

export enum mode {
    /** Discord-like [Markdown syntax](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-).
     * Supports URLs, but not colours. */
    markdown = "markdown",
    /** Minecraft-like [formatting codes](https://minecraft.fandom.com/wiki/Formatting_codes) using ampersands (e.g. 
     * `&e` for yellow). Supports colours, but not URLs. */
    format = "format"
}
