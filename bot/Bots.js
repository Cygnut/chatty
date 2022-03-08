import logger from "./Logger.js";

class Channels {
  #bots = [];

  constructor(bots) {
    this.#bots = bots;
  }

  setReply(reply) {
    this.#bots.forEach(bot => bot.reply = reply);
  }
}

export default Channels;