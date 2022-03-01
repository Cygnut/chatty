import fetch from 'node-fetch';

import logger from '../Logger.js';
import Bot from '../bot/Bot.js';

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
        for (let i = 0; i < result.flavor_text_entries.length; i++) {
            const f = result.flavor_text_entries[i];
            if (f.language.name === "en") {
                // Could filter on f.version.name - the game name - for now though, just use the first one.
                return `${f.flavor_text} (${f.version.name})`;
            }
        }

        return '';
    }

    async onDirectMessage({ content, from }) {
        try {
            const url = `http://pokeapi.co/api/v2/pokemon-species/${content}`;
            const response = await fetch(url);
            const body = await response.json();
            this.reply(
                `${body.name} is a ${body.color.name} ${body.shape.name} ${body.generation.name} pokemon. ${this.getEnFlavourText(body)}`,
                from
            );
        } catch (e) {
            logger.error(`Error handling response ${e}`);
            this.reply("Couldn't ask Professor Oak about it..", from);
        }
    }
}