import path from 'path';

import fetch from 'node-fetch';

import Remote from './pollers/Remote.js';
import Console from './pollers/Console.js';
import Host from './bot/Host.js';
import Loader from './bot/Loader.js';

(async () => {
    const url = 'http://localhost:81/';

    const loader = new Loader(process.cwd() + path.sep + 'bots.config', process.cwd() + path.sep + 'bots');
    const bots = await loader.fromConfigFile();

    const host = new Host();
    host.respond = (from, content) => {
        try {
            fetch.post(url + 'send', { from, content });
        } catch (e) {
            console.error(e);
        }
    };
    host.addBots(bots);

    [
        new Remote(url, msg => host.execute(msg, false)),
        new Console(msg => host.execute(msg, true))
    ]
    .forEach(poller => poller.run());
})();


/*
    better logger
    better folder structure

    better access to host from bots that need it (enable, help, self test), rather than hackily setting bot.host, provide limited interface

    all todos   
    change tab size

    get self-test working (albeit hackily)
    rebuild on a separate branch

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