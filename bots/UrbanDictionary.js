import request from 'request';

import Bot from '../Bot.js';

class UrbanDictionary extends Bot {
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

    async onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
        
        // Get the search result for this search term, specifically, the top related book.
        const url = `http://api.urbandictionary.com/v0/define?term=${content}`;
        
        request(url, (error, response, body) => {
            try {
                if (!error && response.statusCode == 200) {
                    const result = JSON.parse(body);
                    this.send(result.list[0].definition, from);
                } else {
                    console.log(`HTTP request failed with error ${error} status code ${response.statusCode}`);
                    this.send("Couldn't ask UrbanDictionary about it..", from);
                }
            } catch (e) {
                console.log('Error handling response ' + e);
                this.send("Couldn't ask UrbanDictionary about it..", from);
            }
        });
    }
}

export default UrbanDictionary;