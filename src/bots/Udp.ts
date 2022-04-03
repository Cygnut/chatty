import dgram from 'dgram';

import logger from '../Logger.js';
import Bot from '../bot/Bot.js';
import { DirectMessage } from '../bot/Bot.d.js';

export default class Udp extends Bot {
  #defaultPort = 8888;
  #listenText = 'listen';
  #listener: dgram.Socket|null = null;

  constructor() {
    super({
      name: 'udp',
      description: "Dumps udp on receipt at a specified port."
    });
  }

  getTests() {
    return [];
  }

  createListener(port: number) {
    const listener = dgram.createSocket('udp4');

    listener.on('error', e => {
      logger.error(`Udp: Error: ${e.stack}`);
      listener.close();
    });

    listener.on('message', (msg, rinfo) => {
      logger.info(`Udp: Got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    listener.on('listening', () => {
      const address = listener.address();
      logger.info(`Udp: Listening at ${address.address}:${address.port}`);
    });

    // Prevent this object from stopping the entire application from shutting down.
    listener.unref();

    listener.bind(port);

    return listener;
  }

  stop() {
    try {
      if (this.#listener) {
        this.#listener.close();
        this.#listener = null;
      }
    } catch (e) {
      logger.error(`Udp: Error while stopping the udp listener`, e);
      this.#listener = null;
    }
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    if (content.startsWith(this.#listenText)) {
      const portStr = content.substring(this.#listenText.length + 1) || this.#defaultPort.toString();
      const port = parseInt(portStr);
      if (isNaN(port)) {
        this.context.reply(`${portStr} is not a valid port number.`, from);
        return;
      }

      try {
        this.stop();
        this.#listener = this.createListener(port);
        this.context.reply(`Now listening on port ${port}. Use something like 'echo "yoooooo" | nc -4u -w1 localhost ${this.#defaultPort}' to test it.`, from);
      } catch (e) {
        logger.error(`Udp: Error while starting to listen on ${port}`, e);
      }
    }
    else if (content.startsWith('stop')) {
      this.stop();
    }
  }
}