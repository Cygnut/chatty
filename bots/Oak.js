import fetch from 'node-fetch';

import Bot from '../Bot.js';

class Oak extends Bot {
    constructor() {
        super({ 
            name: 'oak', 
            description: "Ask Professor Oak about pokemon." }
        );
    }

    getTests() {
        return [
            this.name + " mewtwo"
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

    async onNewMessage({ content, from, directed }) {
        if (!directed) return;
     
        try {
            const url = `http://pokeapi.co/api/v2/pokemon-species/${content}`;
            const response = await fetch(url);
            const body = await response.json();
            this.send(
                `${body.name} is a ${body.color.name} ${body.shape.name} ${body.generation.name} pokemon. ${this.getEnFlavourText(body)}`, 
                from
            );
        } catch (e) {
            console.error(`Error handling response ${e}`);
            this.send("Couldn't ask Professor Oak about it..", from);
        }
    }
}

export default Oak;