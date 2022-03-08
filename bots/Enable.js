import Bot from '../bot/Bot.js';

export default class Enable extends Bot {
  hub;

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

  async onDirectMessage({ content }) {
    const result = this.hub.enableBot(content);

    if (result === null) {
      this.reply('Did not enable/disable a bot.');
    } else {
      this.reply(`${result ? 'Enabled' : 'Disabled'} ${content}`);
    }
  }
}