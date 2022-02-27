import Bot from '../Bot.js';

class Swear extends Bot {
    #badWords = [];

    constructor() {
        const badWords = [ 'fuck', 'shit', 'crap', 'poop', 'bum' ];
        super({
            name: 'swear', 
            description: `Tells you off if you're a little bitch. Don't say any of these: ${badWords.join()}.` 
        });
        this.#badWords = badWords;
    }

    getTests() {
        return [
            "Fuck you."
        ];
    }


    onNewMessage({ content, from, directed }) {
        if (directed) 
            return;
        
        if (this.#badWords.some(v => content.toLowerCase().indexOf(v) > -1))
            this.send('Oy, you used a bad word! Get out.', from);
    }
}

export default Swear;
