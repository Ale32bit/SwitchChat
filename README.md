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
  if (cmd.command == 'helloworld') {
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

| Friendly name     | Name                     | Trigger                                      |
| ----------------- | ------------------------ | -------------------------------------------- |
| AFK               | afk                      | When someone goes AFK                        |
| Return from AFK   | afk_return               | When someone returnes from AFK               |
| Ingame Chat       | chat_ingame              | When someone sends an ingame chat message    |
| Discord Chat      | chat_discord             | When someone sends a chat message on Discord |
| Chatbox Broadcast | chat_chatbox             | When another chatbox broadcasts              |
| Chatbox command   | command                  | When someone sends a chatbox command         |
| Death             | death                    | When someone dies ingame                     |
| Join              | join                     | When someone joines the game                 |
| Disconnect        | leave                    | When someone leaves the game                 |
| Restart scheduled | server_restart_scheduled | When a restart gets scheduled                |
| Restart cancelled | server_restart_cancelled | When a restart gets cancelled                |

### AFK

- user - `User` that goes AFK

### Return from AFK

- user - `User` that goes AFK

### Ingame Chat

- text - `String` of the contents of the chat message
- rawText - `String` of the raw contents of the chat message
- renderedText - `RenderedTextObject` of the rendered text of the chat message
- user - `User` that sent the message

### Discord Chat

- text - `String` of the contents of the chat message
- rawText - `String` of the raw contents of the chat message
- renderedText - `RenderedTextObject` of the rendered text of the chat message
- discordId - `String` of the Discord snowflake ID of the message
- discordUser - `DiscordUser` that sent the message
- edited - `Boolean` if the message has been edited

### Chatbox Broadcast

- text - `String` of the contents of the broadcast
- rawText - `String` of the raw contents of the broadcast
- renderedText - `RenderedTextObject` of the rendered text of the broadcast
- user - `User` of the owner of the chatbox that broadcasted
- name - `String` name of the chatbox of the chatbox that broadcasted
- rawName - Raw `string` name of the chatbox that broadcasted

### Chatbox Command

- user - `User` that sent the chatbox command
- command - The first part of the command they sent. Eg. \\**command** arg1 arg2
- args - Array of `string`s that contain the args that come after the command
- ownerOnly - `Boolean` that says if this command was visible to everyone's chatbox, or only the owner

### Death

- text - `String` of the death message
- rawText - Raw `string` of the death message
- renderedText - `RenderedTextObject` of the death message
- user - `User` that died
- source - `User` | `null` that killed the user. Only sent if they was killed by a player

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
| Hello packet      | ready   | When switchchat has successfully connected to SwitchCraft |
| Playerlist packet | players | When you connect, and when a player joines/leaves         |
| Error packet      | error   | When there is an error                                    |
| Closing packet    | closing | When the server is closing the connection                 |

### Hello packet

- guest - `Boolean` that says if you are authenticated with the guest key
- licenseOwner - `String` that represents who owns the chatbox license
- capabilities - Array of `string`s that can tell you what capabilities you have

### Playerlist packet

- players - Array of `User`s.

### Error packet

- error - `String` that tells you what type of error that occoured. You can find possible errors at the [SwitchCraft wiki](https://docs.sc3.io/chatbox/websocket.html#error-packet)
- text - `String` that is a human readable version of `error`.

### Closing packet

- closeReason - `String` reson for closing the connection. You can find possible values at the [SwitchCraft wiki](https://docs.sc3.io/chatbox/websocket.html#closing-packet)
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

- id - The discord snowflake ID of the user
- name - The discord name of the user
- displayName - The displayname of the user
- discriminator - The four numbers that identify this user from all the other with the same name
- avatar - URL to the avatar of the user
- roles - Array consisting of roles.

### Rendered Text Object

Weird JSON object that minecraft uses for rendering.

### Mode

- markdown - To use markdown as formatting for outgoing chatbox messages
- format - To use minecraft formatting for outgoing chatbox messages
