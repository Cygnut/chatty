import logger from '../Logger.js';
import Bot from './Bot.js';

export default class Host {
    #bots = [];
    #channels = [];

    onMessage(msg) {
        try {
            this.#bots.forEach(bot => {
                bot.reply = this.reply.bind(this, bot);
            });

            // If it's a message from a bot, then ignore it.
            if (msg.from.startsWith(Bot.PREFIX))
                return;

            // First let's see if it's a general message, or if it's directed at a specific bot.
            const enabledBots = this.#bots.filter(bot => bot.enabled);

            const bot = enabledBots.find(bot => msg.content.startsWith(bot.name));

            if (bot) {
                // Then it's directed at this specific bot and this one alone.
                const content = msg.content.substring(bot.name.length + Bot.PREFIX.length);
                logger.info(`Calling bot ${bot.name} with directed message ${content}`);

                bot.onDirectMessage({
                    from: msg.from,
                    content
                });
            } else {
                logger.info(`Calling all enabled bots with general message ${msg.content}`);

                enabledBots.forEach(bot => {
                    bot.onPublicMessage({
                        from: msg.from,
                        content: msg.content
                    });
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
        if (content === null)
            return;

        // Also check here for asynchronously generated messages from disabled bots, just in case.
        if (!bot.enabled)
            return;

        const response = to ? `@${to}: ${content}` : content;

        logger.info(`${bot.name} replying to message across all channels with content: ${response}`);

        this.#channels.forEach(channel => channel.send(bot.name, response));
    }

    addBot(bot) {
        // Initialise
        bot.host = this;
        bot.reply = () => {};

        // Start
        bot.enable(true);
        this.#bots.push(bot);
    }

    addBots(bots) {
        bots.forEach(bot => this.addBot(bot));
    }

    addChannels(channels) {
        this.#channels = channels;
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