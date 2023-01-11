import * as SwitchChat from "./index";

const client = new SwitchChat.Client("");
console.log("start")
client.on("ready", () => {
    console.log("ready", client.owner);
})

client.on("raw", data => {
    console.log(data);
})

client.on("players", console.log)

client.on("chat_ingame", message => {
    console.log(`<${message.user.name}> ${message.text}`)
})

client.on("chat_discord", message => {
    console.log(`<${message.discordUser.name}#${message.discordUser.discriminator}> ${message.text}`)
});

client.on("command", command => {
    console.log(`${command.user.name}: \\${command.command} ${command.args.join(" ")}`);
})