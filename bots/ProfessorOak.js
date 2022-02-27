import request from 'request';

import Bot from '../Bot.js';

class ProfessorOak extends Bot {
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
        
        const url = `http://pokeapi.co/api/v2/pokemon-species/${content}`;
        
        request(url, (error, response, body) => {
            try {
                if (!error && response.statusCode == 200) {
                    const result = JSON.parse(body);
                    
                    this.send(
                        `${result.name} is a ${result.color.name} ${result.shape.name} ${result.generation.name} pokemon. ${getEnFlavourText(result)}`, 
                        from
                    );
                } else {
                    console.log(`HTTP request failed with error ${error} status code ${response.statusCode}`);
                    this.send("Couldn't ask Professor Oak about it..", from);
                }
            } catch (e) {
                console.log(`Error handling response ${e}`);
                this.send("Couldn't ask Professor Oak about it..", from);
            }
        });
    }
}

export default ProfessorOak;