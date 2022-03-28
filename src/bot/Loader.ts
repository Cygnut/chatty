import path from 'path';
import { readdir } from 'fs/promises';

import logger from '../Logger';
import config from '../Config';
import appPath from '../AppPath';

// Only pick up files which have at least one character before Bot.ts.
const botRegex = /.+.ts/

const stringizeException = (e: unknown): string => e instanceof Error ? `${e} ${e.stack}` : '';

const tryCreateBot = async (filepath: string) => {
  // Load the config file
  let importee = null;
  try {
    importee = await import(`file:///${filepath}`);
  } catch (e) {
    throw new Error(`Failed to load bot source at ${filepath}. ${stringizeException(e)}`);
  }

  if (!('default' in importee)) {
    throw new Error(`Missing default export for ${filepath}`);
  }

  const importedClass = importee.default;

  // Get the bot specific settings for this bot.
  const botConfig = config.bots.find(bot => bot.name === importedClass.name);
  const botSettings = botConfig ? botConfig.settings : {};

  // Instantiate the bot with those settings.
  try {
    return new importedClass(botSettings);
  } catch (e) {
    throw new Error(`Failed to load bot ${importedClass.name}. ${stringizeException(e)}`);
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
      logger.error(`Failed to load bot in ${filepath}`, e);
    }
  };

  return bots;
};

export default loader;