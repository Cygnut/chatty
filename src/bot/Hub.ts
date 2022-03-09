import logger from '../Logger';
import Bot from './Bot';
import { Message, Context } from './Bot.d';
import Bots from './Bots';
import Channels from '../Channels';

interface Options {
  channels: Channels,
  bots: Bots
}

export default class Hub {
  #bots: Bots;
  #channels: Channels;

  constructor({ channels, bots }: Options) {
    this.#channels = channels;
    this.#channels.setOnNewMessage((msg: Message) => this.onMessage(msg));

    this.#bots = bots;
    this.#bots.setContext(bot => this.#buildBotContext(bot))
  }

  #buildBotContext(bot: Bot): Context {
    return {
      enableBot: this.#bots.enableBot.bind(this.#bots),
      describeBots: this.#bots.describeBots.bind(this.#bots),
      onMessage: this.onMessage.bind(this),
      reply: (content: string, to: string) => this.reply(bot, content, to)
    }
  }

  onMessage({ from, content }: Message) {
    try {
      // If it's a message from a bot, then ignore it.
      if (from.startsWith(Bot.PREFIX))
        return;

      // First let's see if it's a general message, or if it's directed at a specific bot.
      const mentionedBot = this.#bots.findMentionedBot(content);

      if (mentionedBot) {
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

  reply(bot: Bot, content: string, to: string) {
    // Also check here for asynchronously generated messages from disabled bots, just in case.
    if (!bot.enabled)
      return;

    const mappedContent = to ? `@${to}: ${content}` : content;
    this.#channels.send({ from: bot.name, content: mappedContent });
  }

  listen() {
    this.#channels.listen();
    return this;
  }
}