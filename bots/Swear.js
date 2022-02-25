const s = require('../Bot');

function Swear()
{
    this.badWords = [ 'fuck', 'shit', 'crap', 'poop', 'bum' ];
    
    s.Bot.call(this, { name: 'swear', description: "Tells you off if you're a little bitch. Don't say any of these: " + this.badWords.join() + "." });
}

Swear.prototype = Object.create(s.Bot.prototype);

Swear.prototype.getTests = function()
{
    return [
        "Fuck you."
    ];
}


Swear.prototype.onNewMessage = function(msg)
{
    if (msg.directed) return;
    
    if (this.badWords.some(function(v) { return msg.content.toLowerCase().indexOf(v) > -1 }))
        this.send('Oy, you used a bad word! Get out.', msg.from);
}

module.exports = Swear;
