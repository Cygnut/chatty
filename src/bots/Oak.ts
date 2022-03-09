import fetch from 'node-fetch';

import logger from '../Logger';
import Bot from '../bot/Bot';
import { DirectMessage } from '../bot/Bot.d';

export default class Oak extends Bot {
  constructor() {
    super({
      name: 'oak',
      description: "Ask Professor Oak about pokemon." }
    );
  }

  getTests() {
    return [
      `${this.name} mewtwo`
    ];
  }

  getEnFlavourText(result) {
    // We could filter on entry.version.name - the game name - for now though, just use the first one.
    const entry = result.flavor_text_entries.find((entry) => entry.language.name === "en");
    return entry ? `${entry.flavor_text} (${entry.version.name})` : '';
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    try {
      const url = `http://pokeapi.co/api/v2/pokemon-species/${content}`;
      const response = await fetch(url);
      const body = await response.json();
      this.context.reply(
        `${body.name} is a ${body.color.name} ${body.shape.name} ${body.generation.name} pokemon. ${this.getEnFlavourText(body)}`,
        from
      );
    } catch (e) {
      logger.error(e);
      this.context.reply("Couldn't ask Professor Oak about it..", from);
    }
  }
}