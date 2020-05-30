// Internal subbots.
const hs = require('./HelpSubbot');
const e = require('./EnableSubbot');
const st = require('./SelfTestSubbot');

function SubbotHost()
{
    // Hook up default event handler for subbot generated response.
    this.respond = function(from, content) {};
    
    this.subbots = [];
    // Add the documentation subbots.
    this.addSubbot(new hs.HelpSubbot(this.getSubbotMetadata.bind(this)));
    this.addSubbot(new e.EnableSubbot(this.enableSubbot.bind(this)));
    this.addSubbot(new st.SelfTestSubbot(this.getSubbotMetadata.bind(this), this.callRespond.bind(this)));
}

SubbotHost.prototype.execute = function(msg)
{
    try
    {
        this.run(msg);
    }
    catch (e)
    {
        console.log('Error handling message ' + e + ', continuing.');
    }
}

// Determine what the bot should do depending on the message.
// If you want to reply, return a string. Else return null to not reply.
SubbotHost.prototype.run = function(msg)
{
    // If it's a message from a subbot, then ignore it.
    if (msg.from.startsWith('~')) return;
    
    //console.log('Received new message: ' + msg.id + ': ' + msg.from + ': ' + msg.content);
    
    // First let's see if it's a general message, or if it's directed at a specific subbot.
    var enabledSubbots = this.subbots.filter(function(subbot) {
        return subbot.enabled;
    });
    
    var subbot = enabledSubbots.find(function(subbot) 
    {
        return msg.content.startsWith(subbot.name);
    });
    
    if (subbot)
    {
        // Then it's directed at this specific subbot and this one alone.
        var term = msg.content.substring(subbot.name.length + 1);
        
        console.log('Calling subbot ' + subbot.name + ' with directed message ' + term);
        
        subbot.onNewMessage({
            from: msg.from,
            content: term,
            directed: true,
        });
    }
    else
    {
        console.log('Calling all enabled subbots with general message ' + msg.content);
        
        // Then it's directed at no specific subbot, so it's general.
        enabledSubbots.forEach(function(subbot) {
            subbot.onNewMessage({
                from: msg.from,
                content: msg.content,
                directed: false,
            });
        });
    }
}

SubbotHost.prototype.getSubbotMetadata = function()
{
    return this.subbots.map(function(subbot)
    {
        var result = 
        {
            name: subbot.name,
            description: subbot.description,
            enabled: subbot.enabled,
            enableable: subbot.enableable,
            tests: subbot.getTests(),
        };
        return result;
    });
}

SubbotHost.prototype.sendResponse = function(subbot, content, to)
{
    if (content === null) return;
    
    // Also check here for asynchronously generated messages from disabled subbots, just in case.
    if (!subbot.enabled) return;
    
    var responseMsg = to ? ('@' + to + ': ' + content) : content;
    
    console.log(subbot.name + ' responding to message with content: ' + responseMsg);
    
    this.callRespond(subbot.name, responseMsg);
}

// Use the wrapper so we can bind to this function (which is invariant under 
// the event handler changing) instead of the event.
SubbotHost.prototype.callRespond = function(from, content)
{
    if (this.respond)
        this.respond(from, content);
}

SubbotHost.prototype.addSubbot = function(subbot)
{
    // Initialise
    subbot.send = this.sendResponse.bind(this, subbot);
    // Start
    subbot.enable(true);
    this.subbots.push(subbot);
}

SubbotHost.prototype.addSubbots = function(subbots)
{
    subbots.forEach(function(subbot) {
        this.addSubbot(subbot);
    }.bind(this));
}

SubbotHost.prototype.enableSubbot = function(subbotName, on)
{
    var subbot = this.subbots.find(function(subbot) {
        return subbot.name === subbotName;
    });
    
    if (!subbot) return null;
    
    // If on is not passed, then flip the state.
    // Else, set to the defined state in on.
    if (on === undefined)
        subbot.enable(!subbot.enabled);
    else
        subbot.enable(on);
    
    return subbot.enabled;
}

module.exports.SubbotHost = SubbotHost;