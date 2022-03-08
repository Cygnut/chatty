import os from 'os';

import Bot from '../bot/Bot.js';

export default class Host extends Bot {
  constructor() {
    super({
      name: 'host',
      description: "Provides information on the host machine."
    });
  }

  getTests() {
    return [
      this.name
    ];
  }

  #formatBytes(bytes, decimals) {
    if (bytes == 0)
      return '0 Bytes';

    const scale = 1000; // or 1024 for binary
    const fractionDigits = decimals + 1 || 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const exponent = Math.floor(Math.log(bytes) / Math.log(scale));
    return parseFloat((bytes / Math.pow(scale, exponent)).toFixed(fractionDigits)) + ' ' + sizes[exponent];
  }

  #formatTime(totalSecondsStr) {
    const totalSeconds = parseInt(totalSecondsStr, 10);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    return [ hours, minutes, seconds ]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  }

  async onDirectMessage() {
    this.context.reply([
      `The OS is ${os.platform()} with ${os.cpus().length} CPU/s.`,
      `The amount of free memory is ${this.#formatBytes(os.freemem())}.`,
      `The amount of total memory is ${this.#formatBytes(os.totalmem())}.`,
      `The total system uptime is ${this.#formatTime(os.uptime())}.`
    ].join('\n'));
  }
}