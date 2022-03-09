import Bot from '../bot/Bot';
import { PublicMessage } from '../bot/Bot.d';

export default class Swear extends Bot {
  #badWords: string[] = [];

  constructor() {
    super({
      name: 'swear',
      description: `Tells you off if you're a little bitch.`
    });
    this.#badWords = [ 'fuck', 'shit', 'crap', 'poop', 'bum' ];
  }

  getTests() {
    return [
      "Fuck you."
    ];
  }

  async onPublicMessage({ content, from }: PublicMessage) {
    if (this.#badWords.some(v => content.toLowerCase().indexOf(v) > -1)) {
      this.context.reply('Oy, you used a bad word! Get out.', from);
    }
  }
}