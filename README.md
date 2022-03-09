# chatty
Plugin-based system of bots used with the chat web site. Plugins interface with multiple web APIs in response to commands from chat users.

# Bots
chatty monitors the current messages in the connected chatroom and passes each message to bot plugins.

### Invokation
Bots are either:
* Directly invoked by starting a line in chat with ~{bot name} (e.g. ~help), followed by arguments for the bot.
* Indirectly invoked by using specific trigger words in chat.


#### Examples
Some example bots are provided:

    Print help for all bots:
    ~help

    Instruct the ~bully bot to target the user with name 'user1':
    ~bully user1

    Indirectly invoke ~swear. The following (unspeakable) word will lead to an admonishment by ~swear:
    Poop
    'Oy, you used a bad word! Get out.'

### Implementation
All bots should extend the Bot class (in Bot.ts), following the examples provided by this codebase.

### Configuration
All bots plugins in the /bots folder are loaded. Any bot specific configuration should be placed in the top level bots.config file, which takes the following form:

```json
{
    "bots":
    [
        {
            "name": "somebot",
            "settings":
            {
                "fieldName": "fieldValue"
            }
        }
    ]
}
```

Now when the bot with name 'botName' is loaded, it is passed the contents of the settings element merged over the global configuration.

### Administration bots
The following bots are for administration of other bots and can not be uninstalled.

| Name | Description |
|------|-------------|
| ~help | Documents bots. |
| ~enable | Enables/disables bots. |
| ~test | Tests the all installed bots. |

### Existing bots

| Name | Description |
|------|-------------|
| ~bully | Bullies a specific user. |
| ~eval | Evaluates a javascript expression. |
| ~goodreads | Finds the top related book for a given search term using the Goodreads Web API. |
| ~host | Provides information on the host machine. |
| ~oak | Ask Professor Oak about pokemon using the Pokemon Web API. |
| ~swear | Tells you off if you're a little bitch. |
| ~ttt | Play tic-tac-toe. |
| ~udp | Dumps udp on receipt at a specified port. |
| ~urban | Tries hard to define words pleasantly.. using the UrbanDictionary Web API. |

### Installing TypeScript on your NodeJS project

Install the dev dependencies required for TypeScript. 'ts-node' is a utility provided to directly run .ts files rather than the 'node' command running .js files.
```sh
npm install typescript ts-node @types/node -D
```

Create a tsconfig.json file to configure TypeScript. See this project's tsconfig.json for an example.
```sh
npx tsc --init
```

To make use of 'ts-node', add the following command to package.json:
```json
"scripts": {
   "start": "ts-node ./src/index.ts"
}
```