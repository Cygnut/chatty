import logger from '../Logger.js';
import Bot from '../bot/Bot.js';
import { DirectMessage } from '../bot/Bot.d.js';

export default class Eval extends Bot {
  constructor() {
    super({
      name: 'eval',
      description: "Evaluates a javascript expression."
    });
  }

  getTests() {
    return [
      `${this.name} 1+1`
    ];
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    let result = '';
    try {
      result = eval(content);
    } catch (e) {
      result = `Error handling Eval message ${content} from ${from} with error ${e}`;
      logger.error(result);
    }

    this.context.reply(result, from);
  }
}