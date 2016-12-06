const s = require('../Subbot');
const animalNamer = require('animal-namer');

function AnimalNamerSubbot()
{
	s.Subbot.call(this, { name: 'animal', description: "Provides you with a random animal name."});
	
	this.namer = new animalNamer();
}

AnimalNamerSubbot.prototype = Object.create(s.Subbot.prototype);

AnimalNamerSubbot.prototype.getTests = function()
{
	return [this.name];
}

AnimalNamerSubbot.prototype.sendResponse = function(msg, name)
{
	this.send('Why not ' + name + '?', msg.from);
}

AnimalNamerSubbot.prototype.onNewMessage = function(msg)
{
	if (!msg.directed) return;
	
	this.namer.name().then(
		this.sendResponse.bind(this, msg)
	);
}

module.exports = AnimalNamerSubbot;