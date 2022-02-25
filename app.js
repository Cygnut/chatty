const request = require('request');

const mp = require('./MessagePoller');

const sh = require('./BotHost');
const sl = require('./BotLoader');

const url = 'http://localhost:81/';

var botLoader = new sl.BotLoader('./bots.config', './bots');
var bots = botLoader.fromConfigFile({});

var botHost = new sh.BotHost();
botHost.respond = function(from, content) 
{
    request.post({
        url:    url + 'send',
        json:    { from: from, content: content }
    }, function(error, response, msg) { });
};
botHost.addBots(bots);

var poller = new mp.MessagePoller(url, botHost.execute.bind(botHost));
poller.run();

/*
    
    Roadmap:
        Combine.
    
    ChatBot:
        
        Store enabled state of each bot persistently.
        
        Fix/finish TicTacToeBot & test it!
        Finish UdpBot, and test it. It currently is not sending to the Chat.
        
        WIP: Support for bots which can send not only on received data, but also on a timer?
        http://pokeapi.co/api/v2/pokemon-species/pikachu/
        
        Combine Chat & ChatBot?
        
        Bots:
            tic-tac-toe
            client stats - requires code merge of ChatBot & Chat
            chat stats
            dump src code (i.e. file browser)
            todos bot
        
    Chat:
        Backup & Restore maybe the last 100 messages.
            WIP - need to test read & write to file first! Currently disabled.
        
        Integrate self testing into app. I.e. have a bot that sends all test messages into the chat.
        
        Better msg ids
    
    Chat & ChatBot:
        Allow them to be hosted forever silently.
    
        
    Client:
        Make more efficient
        
    General:
        Create package.json: 
            https://docs.npmjs.com/getting-started/using-a-package.json
*/