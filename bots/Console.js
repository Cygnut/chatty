import { transports } from 'winston';

import Bot from '../bot/Bot.js';
import logger from '../Logger.js';

export default class Console extends Bot {
  constructor() {
    super({
      name: 'console',
      description: "Configure the console.",
      disableable: false,
    });
  }

  getTests() {
    return [
      `${this.name} off`,
      `${this.name} on`
    ];
  }

  getConsoleLogTransport() {
    return logger.transports.find(transport => transport.name === 'console');
  }

  replyWithConsoleLogTransportStatus(from) {
    this.context.reply(`Console logging is ${this.getConsoleLogTransport().silent ? 'disbled' : 'enabled'}`, from);
  }

  enableConsoleLogTransport(on) {
    this.getConsoleLogTransport().silent = !on;
  }

  async onDirectMessage({ content, from }) {
    content = content.toLowerCase().trim();

    if ([ 'off', 'on' ].includes(content)) {
      this.enableConsoleLogTransport(content === 'on');
    }

    this.replyWithConsoleLogTransportStatus(from);
  }
}