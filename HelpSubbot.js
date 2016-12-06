const s = require('./Subbot');

function HelpSubbot(getSubbotMetadata)
{
	s.Subbot.call(this, { name: 'help', description: "Documents subbots." });
	
	this.getSubbotMetadata = getSubbotMetadata;
}

HelpSubbot.prototype = Object.create(s.Subbot.prototype);

HelpSubbot.prototype.getTests = function()
{
	return [
		this.name,
		this.name + " " + this.name
		];
}

HelpSubbot.prototype.onNewMessage = function(msg) 
{
	if (!msg.directed) return;
	
	this.send(this.getSubbotMetadata().map(function(i) 
	{
		return i.name + ' - ' + i.description + ' ' + (i.enabled ? '(on)' : '(off)');
	}).join('\n'));
}

module.exports.HelpSubbot = HelpSubbot;