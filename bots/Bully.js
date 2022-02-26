import s from './Bot.js';

function Bully()
{
    s.Bot.call(this, { name: 'bully', description: "Bullies a specific user."});
    
    this.targets = [];
}

Bully.prototype = Object.create(s.Bot.prototype);

Bully.prototype.getTests = function()
{
    return [
        this.name + " me"
    ];
}

Bully.prototype.onNewMessage = function(msg) 
{
    if (msg.directed)
    {
        var idx = this.targets.indexOf(msg.content);
        
        var m = '';
        if (idx > -1)    // Then they're a target - remove them.
        {
            this.targets.splice(idx, 1);
            m = 'Awwww man! Gotta stop bullying ' + msg.content + '.';
        }
        else    // Then they're not a target - add them.
        {
            this.targets.push(msg.content);
            m = 'Ooooooh yeahhh! Gonna start bullying ' + msg.content + '.';
        }
        
        this.send(m, msg.from);
    }
    else
    {
        if (this.targets.some(function(target) { return target === msg.from; }))
            this.send('I hate you, ' + msg.from, msg.from);
    }
}

module.exports = Bully;