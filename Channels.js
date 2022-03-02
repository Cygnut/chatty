import logger from "./Logger.js";

class Channels {
    #channels = [];

    constructor(...channels) {
        this.#channels = this.#channels.concat(channels);
    }

    receive() {
        this.#channels.forEach(channel => channel.receive());
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