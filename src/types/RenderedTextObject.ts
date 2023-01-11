export interface RenderedTextObject {
    extra: {
        [key: string]: any,
        text: string,
    }[];
    text: string;
}