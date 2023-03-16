# SwitchChat v3

SwitchCraft Chatbox v2 module for Node.js written in TypeScript

[![npm version](https://badge.fury.io/js/switchchat.svg)](https://www.npmjs.org/package/switchchat)

## Installation

```terminal
npm i --save switchchat
```

## Example

See [SwitchCraft Chatbox docs](https://docs.sc3.io/chatbox/) for more information regarding chatbox.

To show you how to use the switchchat we will be building an helllo world bot.

1. Start by logging onto SwitchCraft and grabbing your token by running `/chatbox license`. Pro tip: You can click the token to copy it to your clipboard
2. Open up a new JavaScript or TypeScript file, setup npm with `npm init -y`, and then install switchchat by running `npm i switchchat`. To make sure ESM modules are used, go in package.jseon and set `"type": "module"`.
3. In your program paste the following code in.

```ts
// Import switchchat
import { Client } from 'switchchat';

// Create the client
const sc = new Client('YOUR-CHATBOX-TOKEN');

// Add event listener for when a command is fired
sc.on('command', (cmd) => {
  // Only respond if the command is `\helloworld`
  if (cmd.command === 'helloworld') {
    // Send message to the user: "Hello World!"
    sc.tell(cmd.user.name, 'Hello World!');
  }
});

// Connect
sc.connect();
console.log('Connected');
```

4. Run your code! If you used JavaScript you can run it with `node yourfile.js`. When it says it is connected, go on SwitchCraft and run `\helloworld`. It should the respond to you!

## Events

You are able to listen after the following events:

| Friendly name     | Name                     | Trigger                                    |
| ----------------- | ------------------------ | ------------------------------------------ |
| AFK               | afk                      | A player went AFK                          |
| AFK return        | afk_return               | A player returned from being AFK           |
| In-game chat      | chat_ingame              | A player sent a message in-game            |
| Discord chat      | chat_discord             | A player sent a message from Discord       |
| Chatbox message   | chat_chatbox             | A chatbox sent a public message            |
| Chatbox command   | command                  | A player sent a chatbox command in-game    |
| Death             | death                    | A player died                              |
| Join              | join                     | A player joined the server                 |
| Disconnect        | leave                    | A player left the server                   |
| Restart scheduled | server_restart_scheduled | The server will restart soon               |
| Restart cancelled | server_restart_cancelled | The scheduled server restart was cancelled |

### AFK

- user - `User` that goes AFK

### AFK return

- user - `User` that went AFK

### Ingame Chat

- text - `String` of the contents of the chat message
- rawText - `String` of the raw contents of the chat message
- renderedText - `RenderedTextObject` of the rendered text of the chat message
- user - `User` that sent the message

### Discord chat

- text - `string` of the contents of the chat message, without formatting codes
- rawText - `string` of the raw contents of the chat message, with its original formatting codes
- renderedText - `RenderedTextObject` of the rendered text of the chat message
- discordId - `string` of the Discord snowflake ID of the message
- discordUser - `DiscordUser` that sent the message
- edited - `boolean` if the message has been edited

### Chatbox message

- text - `string` of the contents of the message, without formatting codes
- rawText - `string` of the raw contents of the message, with its original formatting codes
- renderedText - `RenderedTextObject` of the rendered text of the message
- user - `User` of the owner of the chatbox
- name - `string` name of the chatbox, without formatting codes
- rawName - `string` name of the chatbox, with its original formatting codes

### Chatbox command

- user - `User` that sent the chatbox command
- command - The first part of the command they sent. Eg. \\**command** arg1 arg2
- args - Array of `string`s that contain the args that come after the command
- ownerOnly - `boolean` if the command is an owner-only command (`^command`)

### Death

- text - `string` of the death message contents, without formatting codes
- rawText - `string` of the death message contents, with its original formatting codes
- renderedText - `RenderedTextObject` of the death message
- user - `User` that died
- source - `User` | `null` that killed the user. Only set if they were killed by another player

### Join

- user - `User` that joined the server

### Disconnect

- user - `User` that left the server

### Server restart scheduled

Not fully implemented

### Server restart cancelled

Not fully implemented

## Server -> Client packets

You are also able to listen after these packets that are sent by SwitchCraft to the client.

| Friendly name     | Name    | Trigger                                                   |
| ----------------- | ------- | --------------------------------------------------------- |
| Hello packet      | ready   | When SwitchChat has successfully connected to SwitchCraft |
| Playerlist packet | players | When you connect, and when a player joins/leaves          |
| Error packet      | error   | When there is an error                                    |
| Closing packet    | closing | When the server is closing the connection                 |

### Hello packet

- guest - `Boolean` that says if you are authenticated with the guest key
- licenseOwner - `String` that represents who owns the chatbox license
- capabilities - Array of `string`s that can tell you what capabilities you have

### Playerlist packet

- players - Array of `User`s.

### Error packet

- error - `String` that tells you what type of error that occoured. You can find possible errors at the [SwitchCraft documentation](https://docs.sc3.io/chatbox/websocket.html#error-packet).
- text - `String` that is a human readable version of `error`.

### Closing packet

- closeReason - `String` reson for closing the connection. You can find possible values at the [SwitchCraft documentation](https://docs.sc3.io/chatbox/websocket.html#closing-packet).
- reason - `String` that is a human readable version of `closeReason`

## Methods

You can run these methods on your client instance.

### tell

Syntax: `await client.tell(username, text, name, mode)`
Sends a message to a player.

| Argument | Type   | Description                                              |
| -------- | ------ | -------------------------------------------------------- |
| username | string | The username of the player you want to send a message to |
| text     | string | The text contents you want to send                       |
| name     | string | The name of your chatbox                                 |
| mode     | Mode   | The formatting mode                                      |

### say

Syntax: `await client.say(text, name, mode)`
This method broadcasts the text to all online players.

| Argument | Type   | Description               |
| -------- | ------ | ------------------------- |
| text     | string | The text you want to send |
| name     | string | The name of your chatbox  |
| mode     | Mode   | The formatting mode       |

### connect

Syntax: `client.connect()`
Connects to SwitchCraft

### close

Syntax: `client.close()`
Disconnects the connection to SwitchCraft

### reconnect

Syntax: `client.reconnect()`
Reconnects to SwitchCraft

## Data types

### User

- name - The minecraft name without prefixes similar
- uuid - The minecraft UUID of the player
- displayName - The name as it appears in chat
- group - The group the player is in. `default`, `moderator` or `admin`
- pronouns - Not yet implemented in SwitchChat v3
- world - The world the player is in. Either the full name like `minecraft:nether` or null
- afk - If the player is AFK

### Discord User

- id - The Discord snowflake ID of the user
- name - The Discord name of the user
- displayName - The user's server nickname on Discord, or their username if it is not set
- discriminator - The user's discriminator on Discord
- avatar - URL to the avatar of the user
- roles - Array consisting of roles.

### Rendered Text Object

Minecraft's serialised [raw JSON text format](https://minecraft.fandom.com/wiki/Raw_JSON_text_format). See the [SwitchCraft documentation](https://docs.sc3.io/chatbox/websocket.html#raw-json-text-object) for more information on how this is used.

### Mode

The mode to use for outgoing chatbox messages (`.say()`, `.tell()`). 

- markdown - Discord-like [Markdown syntax](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-). Supports URLs, but not colours.
- format - Minecraft-like [formatting codes](https://minecraft.fandom.com/wiki/Formatting_codes) using ampersands (e.g. `&e` for yellow). Supports colours, but not URLs.
