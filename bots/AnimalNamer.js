import _AnimalNamer from 'animal-namer';

import Bot from '../Bot.js';

class AnimalNamer extends Bot {
    #namer;

    constructor() {
        super({ 
            name: 'animal', 
            description: "Provides you with a random animal name."
        });
        
        this.#namer = new _AnimalNamer();
    }

    getTests() {
        return [ this.name ];
    }

    async onNewMessage({ content, from, directed })
    {
        if (!directed) 
            return;

        // new _AnimalNamer().name().then(console.log);

        //this.#namer.name()
            //.then(console.log);

        // console.log('24');
        //const self = this;
        //this.#namer.name().then(function(name) { self.send(`Why not ${name}?`, from) });
    }
}

export default AnimalNamer;