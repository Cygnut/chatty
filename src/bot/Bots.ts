import logger from "../Logger.js";
import { Context, Description } from './Bot.d.js';
import Bot from './Bot.js'

class Channels {
  #bots: Bot[] = [];

  constructor(bots: Bot[]) {
    this.#bots = bots;
  }

  setContext(context: (bot: Bot) => Context) {
    this.#bots.forEach(bot => bot.context = context(bot));
  }

  getEnabledBots() {
    return this.#bots.filter(bot => bot.enabled);
  }

  findMentionedBot(content: string) {
      return this.getEnabledBots().find(bot => content.startsWith(bot.name));
  }

  describeBots(): Description[] {
    return this.#bots.map(bot => ({
      name: bot.name,
      description: bot.description,
      enabled: bot.enabled,
      disableable: bot.disableable,
      tests: bot.getTests(),
    }));
  }

  enableBot(botName: string, on: boolean|null = null) {
    const bot = this.#bots.find(bot => bot.name === botName);

    if (!bot) {
      logger.info(`Failed to find bot of name ${botName} to enable/disable`)
      return null;
    }

    // If on is not passed, then flip the state - else, set to the defined state in on.
    bot.enable(on === null ? !bot.enabled : on);
    return bot.enabled;
  }
}

export default Channels;