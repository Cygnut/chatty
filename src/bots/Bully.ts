import Bot from '../bot/Bot.js';
import { DirectMessage, PublicMessage } from '../bot/Bot.d.js';

export default class Bully extends Bot {
  #targets: string[] = [];

  constructor() {
    super({
      name: 'bully',
      description: "Bullies a specific user."
    });
  }

  getTests() {
    return [
      `${this.name} me`
    ];
  }

  async onDirectMessage({ content, from }: DirectMessage)
  {
    const index = this.#targets.indexOf(content);

    let message = '';
    if (index > -1) {
      // Then they're a target - remove them.
      this.#targets.splice(index, 1);
      message = `Awwww man! Gotta stop bullying ${content}.`;
    } else {
      // Then they're not a target - add them.
      this.#targets.push(content);
      message = `Ooooooh yeahhh! Gonna start bullying ${content}.`;
    }

    this.context.reply(message, from);
  }

  async onPublicMessage({ from }: PublicMessage)
  {
    if (this.#targets.some(target => target === from)) {
      this.context.reply(`I hate you, ${from}`, from);
    }
  }
}