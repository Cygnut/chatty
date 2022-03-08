import logger from "./Logger.js";

class Channels {
  #channels = [];

  constructor(channels) {
    this.set(channels);
  }

  set(channels) {
    this.#channels = channels
  }

  setOnNewMessage(onNewMessage) {
    this.#channels.forEach(channel => channel.setOnNewMessage(onNewMessage));
  }

  listen() {
    this.#channels.forEach(channel => channel.listen());
  }

  send(message) {
    // Don't bother forwarding an empty message.
    if (message.content === null)
      return;

    logger.info(`${message.from} replying to message across all channels with content: ${message.content}`);

    this.#channels.forEach(channel => channel.send(message));
  }
}

export default Channels;