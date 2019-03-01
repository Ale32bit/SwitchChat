# SwitchChat
### SwitchCraft ChatBox Module for Node.js

## Installation

```
npm i --save switchchat
```

# Usage
```js
// Require module
const SwitchChat = require( "switchchat" );

// Create new client
const client = new SwitchChat.Client( "your licence" );

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

// Get list of online players (Map)
console.log( client.players );
```

# Events
These events are fired on client. You can listen to them with `client.on( event, callback )`
* chat - Get messages from in-game chat. Returns ChatMessage
* discord - Get messages from Discord chat. Returns DiscordMessage
* command - Get commands from players. Returns Command
* players - Get players list each time a player joins or leave. Returns Map: UUID = Player
* join - Get player that just joined. Returns Player
* leave - Get player that just left. Returns Player
* death - Get player that just died. Returns Death
* afk - Get player that went away from keyboard. Returns Player
* afk_return - Get player that came back from AFK. Returns Player
* closing - The server is closing and the client will try to reconnect. Returns Object `{reason, closeReason}`

# Classes
Events return these classes:

#### Player
* name - Username of the player
* uuid - UUID of the player
* displayName - Nickname with color codes
* displayNameFormatted - tellraw equivalent
* nickname - Same as displayName
* username - Same as name
* world - The world the player is in
* group - Permissions group of the player
* `tell( message, label, mode )` - Tell a message to the player

#### ChatMessage
* message - Textual message
* rawMessage - Message with color codes
* renderedMessage - tellraw equivalent
* player - Class Player

#### Command
* command - First part of the full command (the word after `\\`)
* args - Arguments of the command
* raw - full command
* player - Class Player
* `reply( message, label, mode )` - Equivalent of `Player.tell`

#### Death
* message - Death message
* renderedMessage - Death message with color codes
* player - Class Player

#### DiscordUser
* id - Snowflake of the user
* name - Username of the user
* displayName - Username with color codes
* discriminator - The 4 numbers of the username `#0123`
* avatar - Avatar URL of the user
* roles - Roles of the user
* `username()` - Get full username with discriminator

#### DiscordMessage
* id - Snowflake of the message
* message - Textual message
* rawText - tellraw equivalent
* user - Class DiscordUser
* edited - If the message has been edited. (boolean)

#### DiscordRole
* id - Snowflake of the role
* name - Role name
* color - Color of the role
* colour - Colour of the role
