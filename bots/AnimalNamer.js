import Bot from '../Bot.js';
import animalNamer from 'animal-namer';

class AnimalNamer extends Bot {
    #namer;

    constructor() {
        super({ 
            name: 'animal', 
            description: "Provides you with a random animal name."
        });
        
        this.#namer = new animalNamer();
    }

    getTests() {
        return [ this.name ];
    }

    sendResponse(msg, name) {
        this.send('Why not ' + name + '?', msg.from);
    }

    async onNewMessage({ content, from, directed })
    {
        if (!directed) 
            return;
        
        this.#namer.name().then(() => this.sendResponse(msg));
    }
}

export default AnimalNamer;