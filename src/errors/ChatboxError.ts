export default class ChatboxError extends Error {
    public error: string;
    public id: number;
    constructor(message: string, error: string, id: number) {
        super(message);
        this.error = error;
        this.id = id;
    }
}