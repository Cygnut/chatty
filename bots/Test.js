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
    for (const test of this.generateTests()) {
      logger.info(test);
      this.host.onMessage({ from: this.#from, content: test });
    }
  }
}