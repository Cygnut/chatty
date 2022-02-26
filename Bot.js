class Bot {
    name;
    description;
    disableable;
    enabled;

    constructor({ name, description, disableable }) {
        this.name = '~' + name;
        this.description = description;
        // Indicates ability to be disabled. Defaults to true.
        this.disableable = settings.hasOwnProperty("disableable") ? disableable : true;
        this.enabled = false;
    }

    enable(on) {
        //console.log(this.disableable)
        //console.log(!on && !this.disableable)
        
        // If we're not allowed to disable this bot, then we're done.
        if (!on && !this.disableable) 
            return;
        
        console.log((on ? 'Enabling' : 'Disabling') + ' ' + this.name);
        
        this.enabled = on;
        if (this.onEnabled)
            this.onEnabled(on);
    }
    
    onNewMessage({ content, from, directed }) {
    }
}

export default Bot;
