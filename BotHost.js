// Internal bots.
const hs = require('./Help');
const e = require('./Enable');
const st = require('./SelfTest');

function BotHost()
{
    // Hook up default event handler for bot generated response.
    this.respond = function(from, content) {};
    
    this.bots = [];
    // Add the documentation bots.
    this.addBot(new hs.Help(this.getBotMetadata.bind(this)));
    this.addBot(new e.Enable(this.enableBot.bind(this)));
    this.addBot(new st.SelfTest(this.getBotMetadata.bind(this), this.callRespond.bind(this)));
}

BotHost.prototype.execute = function(msg, local)
{
    try
    {
        this.run(msg, local);
    }
    catch (e)
    {
        console.log('Error handling message ' + e + ', continuing.');
    }
}

// Determine what the bot should do depending on the message.
// If you want to reply, return a string. Else return null to not reply.
BotHost.prototype.run = function(msg, local)
{
    var self = this;
    this.bots.forEach(function(bot) {
        bot.send = self.sendResponse.bind(self, bot, local);
    });

    // If it's a message from a bot, then ignore it.
    if (msg.from.startsWith('~')) return;
    
    // First let's see if it's a general message, or if it's directed at a specific bot.
    var enabledBots = this.bots.filter(function(bot) {
        return bot.enabled;
    });
    
    var bot = enabledBots.find(function(bot) 
    {
        return msg.content.startsWith(bot.name);
    });
    
    if (bot)
    {
        // Then it's directed at this specific bot and this one alone.
        var term = msg.content.substring(bot.name.length + 1);
        
        console.log('Calling bot ' + bot.name + ' with directed message ' + term);
        
        bot.onNewMessage({
            from: msg.from,
            content: term,
            directed: true,
        });
    }
    else
    {
        console.log('Calling all enabled bots with general message ' + msg.content);
        
        // Then it's directed at no specific bot, so it's general.
        enabledBots.forEach(function(bot) {
            bot.onNewMessage({
                from: msg.from,
                content: msg.content,
                directed: false,
            });
        });
    }
}

BotHost.prototype.getBotMetadata = function()
{
    return this.bots.map(function(bot)
    {
        var result = 
        {
            name: bot.name,
            description: bot.description,
            enabled: bot.enabled,
            enableable: bot.enableable,
            tests: bot.getTests(),
        };
        return result;
    });
}

BotHost.prototype.sendResponse = function(bot, local, content, to)
{
    if (content === null) return;
    
    // Also check here for asynchronously generated messages from disabled bots, just in case.
    if (!bot.enabled) return;
    
    var responseMsg = to ? ('@' + to + ': ' + content) : content;
    
    console.log(bot.name + ' responding to message with content: ' + responseMsg);
    
    if (local)
        console.log(responseMsg);
    else
        this.callRespond(bot.name, responseMsg);
}

// Use the wrapper so we can bind to this function (which is invariant under 
// the event handler changing) instead of the event.
BotHost.prototype.callRespond = function(from, content)
{
    if (this.respond)
        this.respond(from, content);
}

BotHost.prototype.addBot = function(bot)
{
    // Initialise
    bot.send = function() {};
    // Start
    bot.enable(true);
    this.bots.push(bot);
}

BotHost.prototype.addBots = function(bots)
{
    bots.forEach(function(bot) {
        this.addBot(bot);
    }.bind(this));
}

BotHost.prototype.enableBot = function(botName, on)
{
    var bot = this.bots.find(function(bot) {
        return bot.name === botName;
    });
    
    if (!bot) return null;
    
    // If on is not passed, then flip the state.
    // Else, set to the defined state in on.
    if (on === undefined)
        bot.enable(!bot.enabled);
    else
        bot.enable(on);
    
    return bot.enabled;
}

module.exports.BotHost = BotHost;