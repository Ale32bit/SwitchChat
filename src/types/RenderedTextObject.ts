/** 
 * Minecraft-compatible raw JSON text.
 * 
 * @see https://minecraft.fandom.com/wiki/Raw_JSON_text_format
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
