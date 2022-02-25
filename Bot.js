function Bot(settings)
{
    this.name = '~' + settings.name;
    this.description = settings.description;
    // Indicates ability to be disabled. Defaults to true.
    this.disableable = settings.hasOwnProperty("disableable") ? settings.disableable : true;
    
    this.enabled = false;
    
    this.enable = function(on)
    {
        //console.log(this.disableable)
        //console.log(!on && !this.disableable)
        
        // If we're not allowed to disable this bot, then we're done.
        if (!on && !this.disableable) return;
        
        console.log((on ? 'Enabling' : 'Disabling') + ' ' + this.name);
        
        this.enabled = on;
        if (this.onEnabled)
            this.onEnabled(on);
    }
}

module.exports.Bot = Bot;
