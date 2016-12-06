const request = require('request');

const mp = require('./MessagePoller');

const sh = require('./SubbotHost');
const sl = require('./SubbotLoader');

const url = 'http://localhost:81/';

var subbotLoader = new sl.SubbotLoader('./subbots.config', './Subbots');
var subbots = subbotLoader.fromConfigFile({});

var subbotHost = new sh.SubbotHost();
subbotHost.respond = function(from, content) 
{
	request.post({
		url:	url + 'send',
		json:	{ from: from, content: content }
	}, function(error, response, msg) { });
};
subbotHost.addSubbots(subbots);

var poller = new mp.MessagePoller(url, subbotHost.execute.bind(subbotHost));
poller.run();

/*
	
	Roadmap:
		Combine.
	
	ChatBot:
		
		Store enabled state of each subbot persistently.
		
		Fix/finish TicTacToeSubbot & test it!
		Finish UdpSubbot, and test it. It currently is not sending to the Chat.
		
		WIP: Support for subbots which can send not only on received data, but also on a timer?
		http://pokeapi.co/api/v2/pokemon-species/pikachu/
		
		Combine Chat & ChatBot?
		
		Subbots:
			tic-tac-toe
			client stats - requires code merge of ChatBot & Chat
			chat stats
			dump src code (i.e. file browser)
			todos subbot
		
	Chat:
		Backup & Restore maybe the last 100 messages.
			WIP - need to test read & write to file first! Currently disabled.
		
		Integrate self testing into app. I.e. have a subbot that sends all test messages into the chat.
		
		Better msg ids
	
	Chat & ChatBot:
		Allow them to be hosted forever silently.
	
		
	Client:
		Make more efficient
		
	General:
		Create package.json: 
			https://docs.npmjs.com/getting-started/using-a-package.json
*/