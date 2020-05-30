const s = require('../Subbot');

function SwearSubbot()
{
    this.badWords = [ 'fuck', 'shit', 'crap', 'poop', 'bum' ];
    
    s.Subbot.call(this, { name: 'swear', description: "Tells you off if you're a little bitch. Don't say any of these: " + this.badWords.join() + "." });
}

SwearSubbot.prototype = Object.create(s.Subbot.prototype);

SwearSubbot.prototype.getTests = function()
{
    return [
        "Fuck you."
    ];
}


SwearSubbot.prototype.onNewMessage = function(msg)
{
    if (msg.directed) return;
    
    if (this.badWords.some(function(v) { return msg.content.toLowerCase().indexOf(v) > -1 }))
        this.send('Oy, you used a bad word! Get out.', msg.from);
}

module.exports = SwearSubbot;
