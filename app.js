import path from 'path';

import logger from './Logger.js';
import Remote from './channels/Remote.js';
import Console from './channels/Console.js';
import Host from './bot/Host.js';
import Loader from './bot/Loader.js';

(async () => {
    const url = 'http://localhost:81/';

    const cwd = `${process.cwd()}${path.sep}`;
    const loader = new Loader(`${cwd}bots.config`, `${cwd}bots`);
    const bots = await loader.fromConfigFile();

    const host = new Host();

    const channels = [
        new Remote(url, msg => host.onMessage(msg)),
        new Console(msg => host.onMessage(msg))
    ];

    host.addChannels(channels);
    host.addBots(bots);

    channels.forEach(channel => channel.receive());
})();


/*
    no prompt after '~urban poop'

    fix weird load order (of where channels depend on host being defined)
    clean up app.js

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