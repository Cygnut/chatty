const s = require('../Bot');

function Eval()
{
    s.Bot.call(this, { name: 'eval', description: "Evaluates a javascript expression."});
}

Eval.prototype = Object.create(s.Bot.prototype);

Eval.prototype.getTests = function()
{
    return [
        this.name + " 1+1"
        ];
}

Eval.prototype.onNewMessage = function(msg) 
{
    if (!msg.directed) return;
    
    var result = '';
    
    try
    {
        result = eval(msg.content);
    }
    catch (e)
    {
        var errMsg = 'Error handling Eval message ' + msg.content + ' from ' + msg.from + ' with error ' + e;
        console.log(errMsg);
        this.send(errMsg, msg.from);
        return;
    }
    
    this.send(result, msg.from);
}

module.exports = Eval;