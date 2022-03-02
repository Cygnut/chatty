import path from 'path';
import { readFile, readdir } from 'fs/promises';

import logger from '../Logger.js';

// TODO: Pass url in here.
// TODO: describe bots.config syntax here.
export default class Loader {
    #configFilepath;
    #botsDir;
    // Only pick up files which have at least one character before Bot.js.
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

    async tryCreateBot(filepath) {
        // Load the config file
        const config = JSON.parse(await readFile(this.#configFilepath, 'utf8'));

        let importee = null;
        try {
            importee = await import(`file:///${filepath}`);
        } catch (e) {
            throw new Error(`Failed to load bot source at ${filepath}. ${e} ${e.stack}`);
        }

        if (!('default' in importee)) {
            throw new Error(`Missing default export for ${filepath}`);
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
        let filenames = (await readdir(this.#botsDir))
            .filter(filename => filename.match(this.#BOT_REGEX));

        const bots = [];
        for (const filename of filenames) {
            const filepath = `${this.#botsDir}${path.sep}${filename}`;
            try {
                const bot = await this.tryCreateBot(filepath);
                logger.info(`Loaded bot ${bot.name}`);
                bots.push(bot);
            } catch (e) {
                logger.error(`Failed to load bot in ${filepath}: ${e.stack}`);
            }
        };

        return bots;
    }
}