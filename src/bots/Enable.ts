import Bot from '../bot/Bot';
import { DirectMessage } from '../bot/Bot';

export default class Enable extends Bot {
  constructor() {
    super({
      name: 'enable',
      description: "Enables/disables bots.",
      disableable: false,
    });
  }

  getTests() {
    return [];
  }

  async onDirectMessage({ content }: DirectMessage) {
    const result = this.context.enableBot(content);

    if (result === null) {
      this.context.reply('Did not enable/disable a bot.');
    } else {
      this.context.reply(`${result ? 'Enabled' : 'Disabled'} ${content}`);
    }
  }
}