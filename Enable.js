import Bot from './Bot.js';

class Enable extends Bot {
    setEnable;

    constructor(setEnable) {
        super({ 
            name: 'enable', 
            description: "Enables/disables bots.", 
            disableable: false,
        });

        this.setEnable = setEnable;
    }
    
    getTests = function() {
        return [];
    }

    onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
        
        var result = this.setEnable(content);
        
        if (result === null)
            this.send('Did not enable/disable a bot.');
        else
            this.send((result ? 'Enabled' : 'Disabled') + ' ' + content);
    }
}

export default Enable;
