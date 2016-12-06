const s = require('./Subbot');

function SelfTestSubbot(getSubbotMetadata, respond)
{
	s.Subbot.call(this, { name: 'test', description: "Tests the subbot framework." });
	this.getSubbotMetadata = getSubbotMetadata;
	this.respond = respond;
	this.from = 'Test-a-bot';
}

function generateTests(getSubbotMetadata)
{
	// Get an array of tests for each subbot.
	var subbotTests = getSubbotMetadata()
		.map(function(subbot) { return subbot.tests; })
	
	// Merge them all into one array.
	var allTests = [].concat.apply([], subbotTests);
	
	// Generate the full test suite:
	var tests = allTests;
	tests.unshift('STARTING TESTS NOW');
	tests.push('ENDING TESTS NOW');
	return tests;
}

SelfTestSubbot.prototype = Object.create(s.Subbot.prototype);

SelfTestSubbot.prototype.getTests = function()
{
	return [];
}

SelfTestSubbot.prototype.onNewMessage = function(msg)
{
	if (!msg.directed) return;
	
	var tests = generateTests(this.getSubbotMetadata);
	console.log(tests);
	
	// Copy the array into a reversed queue.
	var queue = tests.slice().reverse();
	
	function sendNext()
	{
		var message = queue.pop();
		
		if (message === undefined)
		{
			console.log('No messages left to send - finished sending.');
			clearInterval(timerId);
			return;
		}
		
		this.respond(this.from, message);
	}
	
	var timerId = setInterval(sendNext.bind(this), 1000);
}

module.exports.SelfTestSubbot = SelfTestSubbot;