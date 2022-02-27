class BotHost {
    #bots = [];
    respond = () => {};

    constructor() {
    }

    execute(msg, local) {
        try {
            this.run(msg, local);
        } catch (e) {
            console.error(`Error handling message ${e}, continuing.`);
        }
    }

    // Determine what the bot should do depending on the message.
    // If you want to reply, return a string. Else return null to not reply.
    run(msg, local) {
        this.#bots.forEach(bot => {
            bot.send = this.sendResponse.bind(this, bot, local);
        });

        // If it's a message from a bot, then ignore it.
        if (msg.from.startsWith('~')) 
            return;
        
        // First let's see if it's a general message, or if it's directed at a specific bot.
        const enabledBots = this.#bots.filter(bot => bot.enabled);
        
        const bot = enabledBots.find(bot => msg.content.startsWith(bot.name));
        
        if (bot) {
            // Then it's directed at this specific bot and this one alone.
            const term = msg.content.substring(bot.name.length + 1);
            
            console.log('Calling bot ' + bot.name + ' with directed message ' + term);
            
            bot.onNewMessage({
                from: msg.from,
                content: term,
                directed: true
            });
        } else {
            console.log('Calling all enabled bots with general message ' + msg.content);
            
            // Then it's directed at no specific bot, so it's general.
            enabledBots.forEach(bot => {
                bot.onNewMessage({
                    from: msg.from,
                    content: msg.content,
                    directed: false
                });
            });
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

    sendResponse(bot, local, content, to) {
        if (content === null) 
            return;
        
        // Also check here for asynchronously generated messages from disabled bots, just in case.
        if (!bot.enabled) 
            return;
        
        const response = to ? ('@' + to + ': ' + content) : content;
        
        console.log(`${bot.name} responding to message with content: ${response}`);
        
        if (local) {
            console.log(response);
        } else {
            this.callRespond(bot.name, response);
        }
    }

    // Use the wrapper so we can bind to this function (which is invariant under 
    // the event handler changing) instead of the event.
    callRespond(from, content) {
        if (this.respond) {
            this.respond(from, content);
        }
    }

    addBot(bot) {
        // Initialise
        bot.host = this;
        bot.send = () => {};
        
        // Start
        bot.enable(true);
        this.#bots.push(bot);
    }

    addBots(bots) {
        bots.forEach(bot => this.addBot(bot));
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

export default BotHost;