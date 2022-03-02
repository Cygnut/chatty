import logger from '../Logger.js';
import Bot from '../bot/Bot.js';

export default class Test extends Bot {
    host;
    #from = 'Test-a-bot';

    constructor() {
        super({
            name: 'test',
            description: "Tests the all installed bots."
        });
    }

    generateTests() {
        // Get an array of tests for each bot.
        const botTests = this.host.getBotMetadata()
            .map(bot => { return bot.tests; })

        // Merge them all into one array.
        const allTests = [].concat.apply([], botTests);

        // Generate the full test suite:
        const tests = allTests;
        tests.unshift('STARTING TESTS NOW');
        tests.push('ENDING TESTS NOW');
        return tests;
    }

    getTests() {
        return [];
    }

    async onDirectMessage() {
        const tests = this.generateTests();
        logger.info(tests);

        // Copy the array into a reversed queue.
        const queue = tests.slice().reverse();

        let timerId = null;
        timerId = setInterval(() => {
            const message = queue.pop();

            if (message === undefined) {
                logger.info('No messages left to send - finished sending.');
                clearInterval(timerId);
                return;
            }

            this.host.reply(this.#from, message);
        }, 1000);
    }
}