import { readFileSync, readdirSync } from 'fs';

// TODO: Pass url in here.
// TODO: describe bots.config syntax here.
class BotLoader {
    #configFilepath;
    #botsDir;
    // Only pick up files which have at least one character before bot.js.
    #BOT_REGEX = /.+.js/;

    constructor(configFilepath, botsDir) {
        this.#configFilepath = configFilepath;
        this.#botsDir = botsDir;
    }

    // TODO: Error handling


    // Combine all settings in the pods provided.
    combineSettings(common, specific) {
        const combined = {};
        
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

    fromConfigFile(commonSettings) {
        // Load the config file
        const config = JSON.parse(
            readFileSync(this.#configFilepath, 'utf8')
        );
        
        const filenames = readdirSync(this.#botsDir);
        
        const bots = [];
        
        filenames.forEach(filename => {            
            // Only  load files which have match the filename pattern.
            if (!filename.match(this.#BOT_REGEX))
                return;
            
            let r = null;
            
            try
            {
                r = require(`${this.#botsDir}/${filename}`);
                // TODO: use import() here
                //import r from `${this.#botsDir}/${filename}`;
            }
            catch (err)
            {
                console.log('Failed to load bot source at ' + filename + '. ' + err);
                return;
            }
            
            if (!r) 
                return;
            
            // Strip '.js' to get the name of the class to index with into the config file.
            const className = filename.slice(0, -3);
            
            // Get the bot specific settings for this bot.
            const botConfig = config.bots.find(bot => {
                return bot.name === className;
            });
            
            const botSettings = botConfig ? botConfig.settings : {};
            
            const settings = combineSettings(commonSettings, botSettings);
            
            // Instantiate the bot.
            let s = null;
            
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
            
            if (!s) 
                return;
            
            bots.push(s);
            
        });
        
        return bots;
    }
}

export default BotLoader;