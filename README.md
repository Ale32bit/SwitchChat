# SwitchChat
### SwitchCraft ChatBox Module for Node.js

[![npm version](https://badge.fury.io/js/switchchat.svg)](https://www.npmjs.org/package/switchchat)

## Installation

```
npm i --save switchchat
```

## Usage
```js
// Require module
const SwitchChat = require( "switchchat" );

// Create new client
const client = new SwitchChat.Client( "your licence" ); // new Client(license key, options) 

// Connect to endpoint (returns promise)
client.connect()
  .then(() => {
    console.log( "Connected! Licence owner: " + client.owner );
  })
  .catch(e => {
    console.error( e );
  });

// Listen to events
client.on("chat", function(message){
  console.log( `${message.user}: ${message}` )
});

// Say a message to all players
client.say("Hello, world", "ChatBot");

// Tell a message to a player
client.tell("Steve", "Hello, Steve", "Herobrine");

// Get boolean of the capability
client.hasCapability( "say" );

// Get online players
client.getPlayers();

// Destroy client connection
client.destroy();

// Restart client connection
client.reconnect();
```

## Events
These events are fired on client. You can listen to them with `client.on( event, callback )`
* `chat` - Get messages from in-game chat. Returns Message
* `chat_discord` - Get messages from Discord chat. Returns DiscordMessage
* `command` - Get commands from players. Returns Command
* `players` - Get players list each time a player joins or leave. Returns Map: UUID = Player
* `join` - Get player that just joined. Returns Player
* `leave` - Get player that just left. Returns Player
* `death` - Get player that just died. Returns Death
* `afk` - Get player that went away from keyboard. Returns Player
* `afk_return` - Get player that came back from AFK. Returns Player. NOTE: The server doesn't emit this event
* `ready` - Fired when successfully authenticated.
* `reconnect` - Fired when the WebSocket connection is being reestablished.
* `raw` - Get raw JSON messages from the WebSocket connection. Returns Object

## Classes
Events return these classes:

#### Player
* `type` - Type of user
* `name` - Username of the player
* `uuid` - UUID of the player
* `displayName` - Nickname with color codes
* `displayNameFormatted` - tellraw equivalent
* `world` - The world the player is in
* `group` - Permissions group of the player
* `tell( message, label, prefix, mode )` - Tell a message to the player

#### ChatMessage
* `text` - Textual message
* `rawText` - Message with color codes
* `renderedText` - tellraw equivalent
* `channel` - Message channel
* `time` - JavaScript Date object
* `edited` - If the message is edited
* `user` - Player that sent the message
* `name` - Name of the ChatBox that sent the message (only applicable on ChatBox messages)
* `rawName` - Raw name of the ChatBox that sent the message (only applicable on ChatBox messages)

#### Command
* `command - First part of the full command (the word after `\\`)
* `args` - Arguments of the command
* `rawText` - Full message
* `time` - JavaScript Date object
* `user` - Player that sent the command 
* `reply( message, label, prefix, mode )` - Equivalent of `Player.tell`

#### Death
* `text` - Death message
* `renderedText` - Death message with color codes
* `time` - JavaScript Date object
* `user` - Class Player

#### DiscordUser
* `type` - Type of user
* `id` - Snowflake of the user
* `name` - Username of the user
* `displayName` - Username with color codes
* `displayNameFormatted` - Tellraw equivalent
* `discriminator` - The 4 numbers of the username `#0123`
* `avatar` - Avatar URL of the user
* `roles` - Roles of the user
* `username` - Get full username with discriminator

#### DiscordMessage
* `id` - Snowflake of the message
* `message` - Textual message
* `rawText` - tellraw equivalent
* `user` - Class DiscordUser
* `edited` - If the message has been edited. (boolean)

#### DiscordRole
* `id` - Snowflake of the role
* `name` - Role name
* `color` - Colour of the role
* `colour` - Color of the role

## Client Variables
* `license` - License provided by the user
* `owner` - Owner of the license
* `guest` - Boolean if guest license
* `capabilities` - Array of the capabilities the license has
* `players` - Map of all online players
* `running` - Boolean of the status
* `options` - Options of the client set by the user

### Options
* `queueDelay` - Delay interval of messages queue. Default 500 (in ms)
* `endpoint` - Endpoint of the websocket server.
* `autoReconnect` - Restart connection when closed. Default true
* `reconnectDelay` - Delay before attempting to reconnect. Default 1000 (in ms)

### Capabilities
* `say` - Say a message to all player
* `tell` - Tell a player a message
* `command` - Can listen to commands `\\`
* `read` - Can read chat and Discord messages

### Say/tell modes
* `markdown` - Use Markdown formatting for texts
* `format` - Use normal Minecraft formatting with color/style codes
