import logger from '../Logger.js';
import Bot from '../bot/Bot.js';

export default class Test extends Bot {
  #from = 'Test-a-bot';

  constructor() {
    super({
      name: 'test',
      description: "Tests the all installed bots."
    });
  }

  generateTests() {
    // Get an array of tests for each bot as one flat array.
    const botTests = this.context.describeBots()
      .flatMap(bot => { return bot.tests; })

    // Generate the full test suite:
    const tests = botTests;
    tests.unshift('STARTING TESTS NOW');
    tests.push('ENDING TESTS NOW');
    return tests;
  }

  getTests() {
      return [];
  }

  async onDirectMessage() {
    for (const test of this.generateTests()) {
      logger.info(test);
      this.context.onMessage({ from: this.#from, content: test });
    }
  }
}