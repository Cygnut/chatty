# chatty
Plugin-based system of bots used with the chat web site. Plugins interface with multiple web APIs in response to commands from chat users.

# Subbots
chatty monitors the current messages in the connected chatroom and passes each message to subbot plugins. 

### Invokation
Subbots are either: 
* Directly invoked by starting a line in chat with ~{subbot name} (e.g. ~help), followed by arguments for the subbot.
* Indirectly invoked by using specific trigger words in chat.

#### Examples

    Print help for all subbots:
    ~help
  
    Instruct the ~bully subbot to target the user with name 'user1':
    ~bully user1
  
    Indirectly invoke ~swear. The following (unspeakable) word will lead to an admonishment by ~swear:  
    Poop
    'Oy, you used a bad word! Get out.'
  
### Interface
All subbots should extend the Subbot class (in Subbot.js), and should implement the following interface:

```js
const s = require('./Subbot');

function MySubbot() {
  // Should call Subbot constructor to set subbot metadata.
  s.Subbot.call(this, 
    { 
        name: 'mysubbot', 
        description: "my subbot description", 
        disableable: false,
    });
  
  // send = function(content, to). Callback to send a response. Leave 'to' unset to issue it to no specific user.
  this.send = null;
}

MySubbot.prototype = Object.create(s.Subbot.prototype);

// Optionally implement this event handler to handle the subbot enabled/disabled event. Returns nothing.
MySubbot.prototype.onEnabled = function(on) {
}

// Optionally implement this method to provide tests for this subbot which can be run. Returns an array of test strings.
MySubbot.prototype.getTests = function() {
}

// Required - handles a new message. Responses should be sent using this.send.
// msg =
// {
//   content - [string] the content of the message.
//   from - [string] originator of the message.
//   directed - [bool] true if directed at this specific subbot, else not directed at any subbot.
// }
MySubbot.prototype.onNewMessage = function(msg) {
}
```

### Configuration
All subbots plugins in the /subbots folder are loaded. Any subbot specific configuration should be placed in the top level subbots.config file, which takes the following form:

```json
{
    "subbots":
    [
        {
            "name": "subbot_name",
            "settings":
            {
                "field_name": "field_value"
            }
        }
    ]
}
```

Now when the subbot with name 'subbot_name' is loaded, it is passed the contents of the settings element merged over the global configuration.

### Administration Subbots
The following subbots are for administration of other subbots and can not be uninstalled.

| Name | Description |
|------|-------------|
| ~help | Documents subbots. |
| ~enable | Enables/disables subbots. |
| ~test | Tests the all installed subbots. |

### Existing Subbots

| Name | Description |
|------|-------------|
| ~animal | Provides you with a random animal name. |
| ~bully | Bullies a specific user. |
| ~eval | Evaluates a javascript expression. |
| ~goodreads | Finds the top related book for a given search term using the Goodreads Web API. |
| ~host | Provides information on the host machine. |
| ~oak | Ask Professor Oak about pokemon using the Pokemon Web API. |
| ~swear | Tells you off if you're a little bitch. |
| ~ttt | Play tic-tac-toe. |
| ~udp | Dumps udp on receipt at a specified port. |
| ~urban | Tries hard to define words pleasantly.. using the UrbanDictionary Web API. |
