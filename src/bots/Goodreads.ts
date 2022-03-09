import fs from 'fs';

import fetch from 'node-fetch';
import xml2js from 'xml2js';

import logger from '../Logger';
import Bot from '../bot/Bot';
import { DirectMessage } from '../bot/Bot.d';

export default class Goodreads extends Bot {
  #rootUrl = 'https://www.goodreads.com/';
  #apiKey;

  constructor({ apiKey }) {
    super({
      name: 'goodreads',
      description: "Finds the top related book for a given search term."
    });

    this.#apiKey = apiKey;
  }

  getTests() {
    return [
      `${this.name} mistborn`
    ];
  }

  // For debugging purposes only
  writeJsonObject(o: {}, path: string) {
    fs.writeFile(path, JSON.stringify(o, null, 2), logger.error);
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    this.context.reply('The Goodreads public API has been formally deprecated.', from);
    return;

    try {
      // Get the search result for this search term, specifically, the top related book.
      const url = `${this.#rootUrl}search/index.xml?key=${this.#apiKey}&q=${content}`;
      const response = await fetch(url);
      const body = await response.text();
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(body);
      const title = result?.GoodreadsResponse?.search?.[0]?.results?.[0]?.work?.[0]?.best_book?.[0]?.title?.[0];
      this.context.reply(`So.. were you looking for ${title}?`, from);
    } catch (e) {
      logger.error(e);
      this.context.reply("Couldn't ask Goodreads about it..", from);
    }
  }
}