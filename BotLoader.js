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

    combineSettings(common, specific) {
        const combined = {};
        
        // Copy common into combined to start with.
        for (const prop in common) {
            // Iterate over all of common's own properties.
            if (common.hasOwnProperty(prop)) {
                combined[prop] = common[prop];
            }
        }
        
        // If specific has nothing, then we're done.
        if (specific === null || specific === undefined)
            return combined;
        
        for (const property in specific) {
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

    async tryCreateBot(filename) {
        // Load the config file
        const config = JSON.parse(readFileSync(this.#configFilepath, 'utf8'));

        let importee = null;            
        try {
            importee = await import(`${this.#botsDir}/${filename}`);
        } catch (e) {
            throw new Error(`Failed to load bot source at ${filename}. ${e} ${e.stack}`);
        }

        if (!('default' in importee)) {
            throw new Error(`Missing default export for ${filename}`);
        }

        const importedClass = importee.default;
        
        // Get the bot specific settings for this bot.
        const botConfig = config.bots.find(bot => {
            return bot.name === importedClass.name;
        });
        
        const botSettings = botConfig ? botConfig.settings : {};
        const settings = this.combineSettings({}, botSettings);
        
        // Instantiate the bot with those settings.
        try {
            return new importedClass(settings);
        } catch (e) {
            throw new Error(`Failed to load bot ${importedClass.name}. ${e} ${e.stack}`);
        }
    }

    async fromConfigFile() {
        const filenames = readdirSync(this.#botsDir)
            .filter(filename => filename.match(this.#BOT_REGEX));
        
        const bots = [];        
        for (const filename of filenames) {        
            try {
                const bot = await this.tryCreateBot(filename);
                console.log(`Loaded bot ${bot.name}`);
                bots.push(bot);
            } catch (e) {
                console.error(`Failed to load bot in ${filename}. ${e} ${e.stack}`);
            }
        };
        
        return bots;
    }
}

export default BotLoader;