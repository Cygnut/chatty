import fetch from "node-fetch";

import logger from '../Logger.js';
import Channel from '../Channel.js';

/*
  This is a simple channel that scrapes the Chat app for the latest message and responds to it if it meets certain criteria.
  This could easily be extended to make these criteria and responses more pluggable.
*/
export default class Remote extends Channel {
  #pollingInterval = 500;
  #rootUrl;
  #lastIdSeen = -1;

  constructor(rootUrl) {
    super();
    this.#rootUrl = rootUrl;
  }

  async #poll() {
    try {
      // Just get the last message
      const response = await fetch(`${this.#rootUrl}messages?begin=-1`);
      const body = await response.json();
      const msg = body?.[0];

      if (!msg) {
        return;
      }

      if (this.#lastIdSeen < msg.id) {
        // Then we're looking at a new message.
        try {
          this.onNewMessage(msg);
        } catch (e) {}
        this.#lastIdSeen = msg.id;
      }
    } catch (e) {
      //logger.error(e);
    }
  }

  listen() {
    // Assume every 1/2 second is fast enough to catch every new message in poll.
    setInterval(() => this.#poll(), this.#pollingInterval);
  }

  async send({ from, content }) {
    try {
      await fetch(`${this.#rootUrl}send`, {
        method: 'POST',
        body: JSON.stringify({ from, content })
      });
    } catch (e) {
      //logger.error(`Failed to send message from ${from} with error: ${e.stack}`);
    }
  }
}