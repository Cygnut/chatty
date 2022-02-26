import s from './Bot.js';
import animalNamer from 'animal-namer';

function AnimalNamer()
{
    s.Bot.call(this, { name: 'animal', description: "Provides you with a random animal name."});
    
    this.namer = new animalNamer();
}

AnimalNamer.prototype = Object.create(s.Bot.prototype);

AnimalNamer.prototype.getTests = function()
{
    return [this.name];
}

AnimalNamer.prototype.sendResponse = function(msg, name)
{
    this.send('Why not ' + name + '?', msg.from);
}

AnimalNamer.prototype.onNewMessage = function(msg)
{
    if (!msg.directed) return;
    
    this.namer.name().then(
        this.sendResponse.bind(this, msg)
    );
}

module.exports = AnimalNamer;