import fetch from 'node-fetch';

import logger from '../Logger.js';
import Bot from '../bot/Bot.js';
import { DirectMessage } from '../bot/Bot.d.js';

type OakResponse = {
  name: string,
  color: {
    name: string
  },
  shape: {
    name: string
  },
  generation: {
    name: string
  },
  flavor_text_entries: {
    language: {
      name: string
    },
    flavor_text: string,
    version: {
      name: string
    }
  }[]
}

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

  getEnFlavourText(response: OakResponse): string {
    // We could filter on entry.version.name - the game name - for now though, just use the first one.
    const entry = response.flavor_text_entries.find((entry) => entry.language.name === "en");
    return entry ? `${entry.flavor_text} (${entry.version.name})` : '';
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    try {
      const url = `http://pokeapi.co/api/v2/pokemon-species/${content}`;
      const r = await fetch(url);
      const response: OakResponse = await r.json();
      this.context.reply(
        `${response.name} is a ${response.color.name} ${response.shape.name} ${response.generation.name} pokemon. ${this.getEnFlavourText(response)}`,
        from
      );
    } catch (e) {
      logger.error(e);
      this.context.reply("Couldn't ask Professor Oak about it..", from);
    }
  }
}