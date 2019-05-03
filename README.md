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
  console.log( `${message.player}: ${message}` )
});

// Say a message to all players
client.say("Hello, world", "ChatBot");

// Tell a message to a player
client.tell("Steve", "Hello, Steve", "Herobrine");

// Get boolean of the capability
client.hasCapability( "say" );

// Get player by its UUID
client.getPlayer( "424ac92b-9b6a-47fd-b47d-2f6742fe615d" ); // Returns Ale32bit

// Destroy client connection
client.destroy();

// Restart client connection
client.reconnect();

// Get list of online players (Map)
console.log( client.players );
```

## Events
These events are fired on client. You can listen to them with `client.on( event, callback )`
* `chat` - Get messages from in-game chat. Returns ChatMessage
* `discord` - Get messages from Discord chat. Returns DiscordMessage
* `command` - Get commands from players. Returns Command
* `players` - Get players list each time a player joins or leave. Returns Map: UUID = Player
* `join` - Get player that just joined. Returns Player
* `leave` - Get player that just left. Returns Player
* `death` - Get player that just died. Returns Death
* `afk` - Get player that went away from keyboard. Returns Player
* `afk_return` - Get player that came back from AFK. Returns Player
* `login` - Fired when successfully authenticated.
* `closing` - The server is closing and the client will try to reconnect. Returns Object `{reason, closeReason}`
* `_error` - Fired when the server sends an error. (Appended with _ because it would end the process otherwise)
* `reconnect` - Fired when the WebSocket connection is being reestablished.
* `ws_error` - Fired when the WebSocket connection errored. Returns error
* `ws_message` - Get raw JSON messages from the WebSocket connection. Returns Object

## Classes
Events return these classes:

#### Player
* `name` - Username of the player
* `uuid` - UUID of the player
* `displayName` - Nickname with color codes
* `displayNameFormatted` - tellraw equivalent
* `nickname` - Same as displayName
* `username` - Same as name
* `world` - The world the player is in
* `group` - Permissions group of the player
* `tell( message, label, mode )` - Tell a message to the player

#### ChatMessage
* `message` - Textual message
* `rawMessage` - Message with color codes
* `renderedMessage` - tellraw equivalent
* `player` - Class Player

#### Command
* `command - First part of the full command (the word after `\\`)
* `args` - Arguments of the command
* `raw` - full command
* `player` - Class Player
* `reply( message, label, mode )` - Equivalent of `Player.tell`

#### Death
* `message` - Death message
* `renderedMessage` - Death message with color codes
* `player` - Class Player

#### DiscordUser
* `id` - Snowflake of the user
* `name` - Username of the user
* `displayName` - Username with color codes
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
* `color` - Color of the role
* `colour` - Colour of the role

## Client Variables
* `endpoint` - URL of the WebSocket connection
* `license` - License provided by the user
* `owner` - Owner of the license
* `guest` - Boolean if guest license
* `capabilities` - Array of the capabilities the license has
* `players` - Map of all online players
* `running` - Boolean of the status
* `queueInterval` - Internal queue interval for `say` and `tell` functions
* `messageQueue` - Internal array for the queue interval
* `ws` - WebSocket connection
* `options` - Options of the client set by the user

### Options
* `queueInterval` - Interval of messages queue. Default 350 (in ms)
* `restartOnTellError` - Restart connection if bugged. Default true

### Capabilities
* `say` - Say a message to all player
* `tell` - Tell a player a message
* `command` - Can listen to commands `\\`
* `read` - Can read chat and Discord messages

### Say/tell modes
* `markdown` - Use Markdown formatting for texts
* `format` - Use normal Minecraft formatting with color/style codes
