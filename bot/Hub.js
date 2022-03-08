import logger from '../Logger.js';
import Bots from './Bots.js'
import Bot from './Bot.js';

export default class Hub {
  #bots;
  #channels;

  constructor({ channels, bots }) {
    this.#channels = channels;
    this.#channels.setOnNewMessage(msg => this.onMessage(msg));

    this.#bots = new Bots(bots.map(bot => {
      bot.hub = this;
      return bot;
    }));
  }

  onMessage({ from, content }) {
    try {
      this.#bots.setReply(this.reply.bind(this));

      // If it's a message from a bot, then ignore it.
      if (from.startsWith(Bot.PREFIX))
        return;

      // First let's see if it's a general message, or if it's directed at a specific bot.
      const mentionedBot = this.#bots.findMentionedBot(content);

      if (mentionedBot) {
        // Then it's directed at this specific bot and this one alone.
        content = content.substring(mentionedBot.name.length + Bot.PREFIX.length);
        logger.info(`Calling bot ${mentionedBot.name} with directed message ${content}`);

        mentionedBot.onDirectMessage({ from, content });
      } else {
        logger.info(`Calling all enabled bots with general message ${content}`);

        this.#bots.getEnabledBots().forEach(bot => {
          bot.onPublicMessage({ from, content });
        });
      }
    } catch (e) {
      logger.error(`Error handling message ${e.stack}, continuing.`);
    }
  }

  reply(bot, content, to) {
    // Also check here for asynchronously generated messages from disabled bots, just in case.
    if (!bot.enabled)
      return;

    const mappedContent = to ? `@${to}: ${content}` : content;
    this.#channels.send({ from: bot.name, content: mappedContent });
  }

  listen() {
    this.#channels.listen();
  }

  getBotMetadata() {
    return this.#bots.describeBots();
  }

  enableBot(botName, on) {
    return this.#bots.enableBot(botName, on);
  }
}