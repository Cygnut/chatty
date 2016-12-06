const s = require('../Subbot');

function EvalSubbot()
{
	s.Subbot.call(this, { name: 'eval', description: "Evaluates a javascript expression."});
}

EvalSubbot.prototype = Object.create(s.Subbot.prototype);

EvalSubbot.prototype.getTests = function()
{
	return [
		this.name + " 1+1"
		];
}

EvalSubbot.prototype.onNewMessage = function(msg) 
{
	if (!msg.directed) return;
	
	var result = '';
	
	try
	{
		result = eval(msg.content);
	}
	catch (e)
	{
		var errMsg = 'Error handling EvalSubbot message ' + msg.content + ' from ' + msg.from + ' with error ' + e;
		console.log(errMsg);
		this.send(errMsg, msg.from);
		return;
	}
	
	this.send(result, msg.from);
}

module.exports = EvalSubbot;