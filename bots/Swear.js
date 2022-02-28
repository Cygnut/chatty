import Bot from '../bot/Bot.js';

export default class Swear extends Bot {
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


    async onPublicMessage({ content, from }) {
        if (this.#badWords.some(v => content.toLowerCase().indexOf(v) > -1)) {
            this.reply('Oy, you used a bad word! Get out.', from);
        }
    }
}