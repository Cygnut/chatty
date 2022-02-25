const fs = require('fs');

// TODO: Pass url in here.
// TODO: describe bots.config syntax here.
function BotLoader(configFilepath, botsDir)
{
    this.configFilepath = configFilepath;
    this.botsDir = botsDir;
    // Only pick up files which have at least one character before bot.js.
    this.BOT_REGEX = /.+.js/;
}

// TODO: Error handling


// Combine all settings in the pods provided.
function combineSettings(common, specific)
{
    var combined = {};
    
    // Copy common into combined to start with.
    for (var prop in common)
        if (common.hasOwnProperty(prop))
            // Iterate over all of common's own properties.
            combined[prop] = common[prop];
    
    // If specific has nothing, then we're done.
    if (specific === null || specific === undefined)
        return combined;
    
    for (var property in specific) {
        if (specific.hasOwnProperty(property)) {
            // Iterate over all of specific's own properties.
            
            // If there's a clash between the properties that common and specific has, use common.
            if (combined.hasOwnProperty(property)) 
                continue;
            
            // Otherwise, add the properties from specific
            combined[property] = specific[property];
        }
    }
    
    return combined;
}

BotLoader.prototype.fromConfigFile = function(commonSettings)
{
    // Load the config file
    var config = JSON.parse(
        fs.readFileSync(this.configFilepath, 'utf8')
    );
    
    var filenames = fs.readdirSync(this.botsDir);
    
    var bots = [];
    
    filenames.forEach(function(filename) {
        
        // Only  load files which have match the filename pattern.
        if (!filename.match(this.BOT_REGEX))
            return;
        
        var r = null;
        
        try
        {
            r = require(this.botsDir + '/' + filename);
        }
        catch (err)
        {
            console.log('Failed to load bot source at ' + filename + '. ' + err);
            return;
        }
        
        if (!r) return;
        
        // Strip '.js' to get the name of the class to index with into the config file.
        var className = filename.slice(0, -3);
        
        // Get the bot specific settings for this bot.
        var botConfig = config.bots.find(function(bot) {
            return bot.name === className;
        }.bind(this));
        
        var botSettings = botConfig ? botConfig.settings : {};
        
        var settings = combineSettings(commonSettings, botSettings);
        
        // Instantiate the bot.
        var s = null;
        
        try
        {
            s = new r(settings);
            console.log('Loaded bot ' + className);
        }
        catch (err)
        {
            console.log('Failed to load bot ' + className + '. ' + err);
            return;
        }
        
        if (!s) return;
        
        bots.push(s);
        
    }.bind(this));
    
    return bots;
}

module.exports.BotLoader = BotLoader;