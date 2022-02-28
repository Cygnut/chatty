import fetch from 'node-fetch';

import Bot from '../bot/Bot.js';

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

    async onDirectMessage({ content, from }) {
        try {
            // Get the search result for this search term, specifically, the top related book.
            const url = `http://api.urbandictionary.com/v0/define?term=${content}`;
            const response = await fetch(url);
            const body = await response.json();
            this.send(body.list[0].definition, from);
        } catch (e) {
            console.error(`Error handling response: ${e}`);
            this.send("Couldn't ask UrbanDictionary about it..", from);
        }
    }
}