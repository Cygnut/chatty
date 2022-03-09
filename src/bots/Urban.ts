import fetch from 'node-fetch';

import logger from '../Logger';
import Bot from '../bot/Bot';
import { DirectMessage } from '../bot/Bot.d';

export default class Urban extends Bot {
  constructor() {
    super({
      name: 'urban',
      description: "Looks up shit from UrbanDictionary."
    });
  }

  getTests() {
    return [
      `${this.name} poop`
    ];
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    try {
      // Get the search result for this search term, specifically, the top related book.
      const url = `http://api.urbandictionary.com/v0/define?term=${content}`;
      const response = await fetch(url);
      const body = await response.json();
      this.context.reply(body?.list?.[0]?.definition || '', from);
    } catch (e) {
      logger.error(e);
      this.context.reply("Couldn't ask UrbanDictionary about it..", from);
    }
  }
}