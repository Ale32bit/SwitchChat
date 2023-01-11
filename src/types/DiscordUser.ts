export type DiscordUser = {
    type: string,
    id: string,
    name: string,
    displayName: string;
    discriminator: string;
    avatar: string;
    roles: [
        {
            id: string,
            name: string,
            colour: number
        }
    ]
}