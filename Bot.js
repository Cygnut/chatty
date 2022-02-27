class Bot {
    name;
    description;
    disableable;
    enabled;

    constructor({ name, description, disableable }) {
        this.name = '~' + name;
        this.description = description;
        // Indicates ability to be disabled. Defaults to true.
        this.disableable = disableable === undefined ? true : disableable;
        this.enabled = false;
    }

    enable(on) {
        // If we're not allowed to disable this bot, then we're done.
        if (!on && !this.disableable) 
            return;
        
        console.log((on ? 'Enabling' : 'Disabling') + ' ' + this.name);
        
        this.enabled = on;
        if (this.onEnabled)
            this.onEnabled(on);
    }
    
    onNewMessage({ content, from, directed }) {
        throw Error("Not implemented");
    }
}

export default Bot;
