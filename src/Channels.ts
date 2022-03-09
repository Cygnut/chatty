import logger from './Logger';
import Channel from './Channel';

class Channels {
  #channels: Channel[] = [];

  constructor(channels: Channel[]) {
    this.set(channels);
  }

  set(channels: Channel[]) {
    this.#channels = channels
  }

  setOnNewMessage(onNewMessage) {
    this.#channels.forEach(channel => channel.setOnNewMessage(onNewMessage));
  }

  listen() {
    this.#channels.forEach(channel => channel.listen());
  }

  send({ content, from }) {
    // Don't bother forwarding an empty message.
    if (content === null)
      return;

    logger.info(`${from} replying to message across all channels with content: ${content}`);

    this.#channels.forEach(channel => channel.send({ content, from }));
  }
}

export default Channels;