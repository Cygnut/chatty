import { transports } from 'winston';

import Bot from '../bot/Bot.js';
import logger from '../Logger.js';

export default class Log extends Bot {
  constructor() {
    super({
      name: 'log',
      description: "Configure logging.",
      disableable: false,
    });
  }

  getTests() {
    return [
      `${this.name} off`,
      `${this.name} on`
    ];
  }

  enable(on, from) {
    const consoleLogger = logger.transports.find(transport => transport.name === 'console');
    consoleLogger.silent = !on;

    this.context.reply(`Logging ${on ? 'enabled' : 'disabled'}`, from);
  }

  async onDirectMessage({ content, from }) {
    content = content.toLowerCase();

    if (content === 'off') {
      this.enable(false, from);
    } else if (content === 'on') {
      this.enable(true, from);
    }
  }
}