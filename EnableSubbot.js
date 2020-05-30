const s = require('./Subbot');

function EnableSubbot(setEnable)
{
    s.Subbot.call(this, 
    { 
        name: 'enable', 
        description: "Enables/disables subbots.", 
        disableable: false,
    });
    
    this.setEnable = setEnable;
}

EnableSubbot.prototype = Object.create(s.Subbot.prototype);

EnableSubbot.prototype.getTests = function()
{
    return [];
}

EnableSubbot.prototype.onNewMessage = function(msg) 
{
    if (!msg.directed) return;
    
    var result = this.setEnable(msg.content);
    
    if (result === null)
        this.send('Did not enable/disable a subbot.');
    else
        this.send((result ? 'Enabled' : 'Disabled') + ' ' + msg.content);
}

module.exports.EnableSubbot = EnableSubbot;
