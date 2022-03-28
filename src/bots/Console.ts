import { transports } from 'winston';

import Bot from '../bot/Bot';
import { DirectMessage } from '../bot/Bot.d';
import logger, { silenceConsoleTransport } from '../Logger';

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

  async onDirectMessage({ content, from }: DirectMessage) {
    content = content.toLowerCase().trim();

    if ([ 'off', 'on' ].includes(content)) {
      const silent = content !== 'on';
      silenceConsoleTransport(silent);
      this.context.reply(`Console logging is ${silent ? 'disabled' : 'enabled'}`, from);
    }
  }
}