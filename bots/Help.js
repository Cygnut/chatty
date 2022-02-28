import Bot from '../bot/Bot.js';

export default class Help extends Bot {
    host;

    constructor() {
        super({ 
            name: 'help', 
            description: "Documents bots." 
        });
    }

    getTests() {
        return [
            this.name,
            `${this.name} ${this.name}`
        ];
    }

    async onDirectMessage() {
        this.reply(this.host.getBotMetadata().map(i => {
            return `${i.name} - ${i.description} ${i.enabled ? '(on)' : '(off)'}`;
        }).join('\n'));
    }
}