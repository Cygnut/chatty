import { transports } from 'winston';

import Bot from '../bot/Bot';
import logger from '../Logger';

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
    // Note that this may not be available - e.g. in production!
    return logger.transports.find(transport => transport.name === 'console');
  }

  replyWithConsoleLogTransportStatus(from) {
    const consoleLogTransport = this.getConsoleLogTransport();
    if (consoleLogTransport) {
      this.context.reply(`Console logging is ${this.getConsoleLogTransport().silent ? 'disabled' : 'enabled'}`, from);
    } else {
      this.context.reply('Console logging is unavailable', from);
    }
  }

  enableConsoleLogTransport(on) {
    const consoleLogTransport = this.getConsoleLogTransport();
    if (consoleLogTransport) {
      consoleLogTransport.silent = !on;
    }
  }

  async onDirectMessage({ content, from }) {
    content = content.toLowerCase().trim();

    if ([ 'off', 'on' ].includes(content)) {
      this.enableConsoleLogTransport(content === 'on');
    }

    this.replyWithConsoleLogTransportStatus(from);
  }
}