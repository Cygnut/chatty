import logger from "../Logger.js";

class Channels {
  #bots = [];

  constructor(bots) {
    this.#bots = bots;
  }

  setReply(reply) {
    this.#bots.forEach(bot => bot.reply = reply.bind(bot));
  }

  getEnabledBots() {
    return this.#bots.filter(bot => bot.enabled);
  }

  findMentionedBot(content) {
      return this.getEnabledBots().find(bot => content.startsWith(bot.name));
  }

  describeBots() {
    return this.#bots.map(bot => ({
      name: bot.name,
      description: bot.description,
      enabled: bot.enabled,
      enableable: bot.enableable,
      tests: bot.getTests(),
    }));
  }

  enableBot(botName, on) {
    const bot = this.#bots.find(bot => bot.name === botName);

    if (!bot) {
      logger.info(`Failed to find bot of name ${botName} to enable/disable`)
      return null;
    }

    // If on is not passed, then flip the state - else, set to the defined state in on.
    bot.enable(on === undefined ? !bot.enabled : on);
    return bot.enabled;
  }
}

export default Channels;