import bot from './Bot.js';

class Help extends Bot {
    getBotMetadata;

    constructor(getBotMetadata) {
        super({ 
            name: 'help', 
            description: "Documents bots." 
        });
    
        this.getBotMetadata = getBotMetadata;
    }

    getTests() {
        return [
            this.name,
            this.name + " " + this.name
        ];
    }

    onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
    
        this.send(this.getBotMetadata().map(i => {
            return i.name + ' - ' + i.description + ' ' + (i.enabled ? '(on)' : '(off)');
        }).join('\n'));
    }
}

export default Help;