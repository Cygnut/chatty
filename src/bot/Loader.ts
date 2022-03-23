import path from 'path';
import { readdir } from 'fs/promises';

import logger from '../Logger';
import config from '../Config';
import appPath from '../AppPath';

// Only pick up files which have at least one character before Bot.ts.
const botRegex = /.+.ts/

type Settings = Record<string, string>;

const combineSettings = (common: Settings, specific: Settings) => {
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
};

const tryCreateBot = async (filepath: string) => {
  // Load the config file
  let importee = null;
  try {
    importee = await import(`file:///${filepath}`);
  } catch (e) {
    throw new Error(`Failed to load bot source at ${filepath}. ${e.stack}`);
  }

  if (!('default' in importee)) {
    throw new Error(`Missing default export for ${filepath}`);
  }

  const importedClass = importee.default;

  // Get the bot specific settings for this bot.
  const botConfig = config.bots.find(bot => bot.name === importedClass.name);

  const botSettings = botConfig ? botConfig.settings : {};
  const settings = combineSettings({}, botSettings);

  // Instantiate the bot with those settings.
  try {
    return new importedClass(settings);
  } catch (e) {
    throw new Error(`Failed to load bot ${importedClass.name}. ${e} ${e.stack}`);
  }
};

const loader = async () => {
  const dir = path.join(appPath, 'bots');

  let filenames = (await readdir(dir))
    .filter(filename => filename.match(botRegex));

  const bots = [];
  for (const filename of filenames) {
    const filepath = `${dir}${path.sep}${filename}`;
    try {
      const bot = await tryCreateBot(filepath);
      logger.info(`Loaded bot ${bot.name}`);
      bots.push(bot);
    } catch (e) {
      logger.error(`Failed to load bot in ${filepath}: ${e.stack}`);
    }
  };

  return bots;
};

export default loader;