import Bot from '../Bot.js';

class Enable extends Bot {
    host;

    constructor() {
        super({ 
            name: 'enable', 
            description: "Enables/disables bots.", 
            disableable: false,
        });
    }
    
    getTests() {
        return [];
    }

    async onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
        
        const result = this.host.enableBot(content);
        
        if (result === null)
            this.send('Did not enable/disable a bot.');
        else
            this.send((result ? 'Enabled' : 'Disabled') + ' ' + content);
    }
}

export default Enable;
