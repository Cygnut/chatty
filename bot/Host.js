import logger from '../Logger.js';
import Bot from './Bot.js';

export default class Host {
  #bots = [];
  #channels;

  constructor({ channels, bots }) {
    this.#channels = channels;
    this.#channels.setOnNewMessage(msg => this.onMessage(msg));

    bots.forEach(bot => this.addBot(bot));
  }

  onMessage({ from, content }) {
    try {
      this.#bots.forEach(bot => {
        bot.reply = this.reply.bind(this, bot);
      });

      // If it's a message from a bot, then ignore it.
      if (from.startsWith(Bot.PREFIX))
        return;

      // First let's see if it's a general message, or if it's directed at a specific bot.
      const enabledBots = this.#bots.filter(bot => bot.enabled);

      const bot = enabledBots.find(bot => content.startsWith(bot.name));

      if (bot) {
        // Then it's directed at this specific bot and this one alone.
        content = content.substring(bot.name.length + Bot.PREFIX.length);
        logger.info(`Calling bot ${bot.name} with directed message ${content}`);

        bot.onDirectMessage({ from, content });
      } else {
        logger.info(`Calling all enabled bots with general message ${content}`);

        enabledBots.forEach(bot => {
          bot.onPublicMessage({ from, content });
        });
      }
    } catch (e) {
      logger.error(`Error handling message ${e.stack}, continuing.`);
    }
  }

  getBotMetadata() {
    return this.#bots.map(bot => ({
      name: bot.name,
      description: bot.description,
      enabled: bot.enabled,
      enableable: bot.enableable,
      tests: bot.getTests(),
    }));
  }

  reply(bot, content, to) {
    // Also check here for asynchronously generated messages from disabled bots, just in case.
    if (!bot.enabled)
      return;

    const mappedContent = to ? `@${to}: ${content}` : content;
    this.#channels.send({ from: bot.name, content: mappedContent });
  }

  addBot(bot) {
    // Initialise
    bot.host = this;
    bot.reply = () => {};

    // Start
    bot.enable(true);
    this.#bots.push(bot);
  }

  listen() {
    this.#channels.listen();
  }

  enableBot(botName, on) {
    const bot = this.#bots.find(bot => bot.name === botName);

    if (!bot)
      return null;

    // If on is not passed, then flip the state.
    // Else, set to the defined state in on.
    if (on === undefined) {
      bot.enable(!bot.enabled);
    } else {
      bot.enable(on);
    }

    return bot.enabled;
  }
}