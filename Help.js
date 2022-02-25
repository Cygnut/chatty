const s = require('./Bot');

function Help(getBotMetadata)
{
    s.Bot.call(this, { name: 'help', description: "Documents bots." });
    
    this.getBotMetadata = getBotMetadata;
}

Help.prototype = Object.create(s.Bot.prototype);

Help.prototype.getTests = function()
{
    return [
        this.name,
        this.name + " " + this.name
        ];
}

Help.prototype.onNewMessage = function(msg) 
{
    if (!msg.directed) return;
    
    this.send(this.getBotMetadata().map(function(i) 
    {
        return i.name + ' - ' + i.description + ' ' + (i.enabled ? '(on)' : '(off)');
    }).join('\n'));
}

module.exports.Help = Help;