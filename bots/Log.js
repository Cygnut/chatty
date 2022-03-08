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

  getConsoleTransport() {
    return logger.transports.find(transport => transport.name === 'console');
  }

  replyWithConsoleTransportStatus(from) {
    this.context.reply(`Logging is ${this.getConsoleTransport().silent ? 'disbled' : 'enabled'}`, from);
  }

  enableConsoleTransport(on) {
    this.getConsoleTransport().silent = !on;
  }

  async onDirectMessage({ content, from }) {
    content = content.toLowerCase();

    if (content === 'off') {
      this.enableConsoleTransport(false);
    } else if (content === 'on') {
      this.enableConsoleTransport(true);
    }

    this.replyWithConsoleTransportStatus(from);
  }
}