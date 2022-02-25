const s = require('./Bot');

function Enable(setEnable)
{
    s.Bot.call(this, 
    { 
        name: 'enable', 
        description: "Enables/disables bots.", 
        disableable: false,
    });
    
    this.setEnable = setEnable;
}

Enable.prototype = Object.create(s.Bot.prototype);

Enable.prototype.getTests = function()
{
    return [];
}

Enable.prototype.onNewMessage = function(msg) 
{
    if (!msg.directed) return;
    
    var result = this.setEnable(msg.content);
    
    if (result === null)
        this.send('Did not enable/disable a bot.');
    else
        this.send((result ? 'Enabled' : 'Disabled') + ' ' + msg.content);
}

module.exports.Enable = Enable;
