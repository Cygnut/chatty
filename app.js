import path from 'path';

import logger from './Logger.js';
import Remote from './channels/Remote.js';
import Console from './channels/Console.js';
import Channels from './Channels.js';
import Host from './bot/Host.js';
import loader from './bot/Loader.js';
import config from './Config.js';

(async () => {
  const host = new Host();
  const channels = new Channels();
    
  channels.set(
    new Remote(config.channels.remote.url, msg => host.onMessage(msg)),
    new Console(msg => host.onMessage(msg))
  );

  host.addChannels(channels);
  host.addBots(await loader());

  channels.receive();
})();


/*
  change tab size

  better error handling in config.json, and enforce structure.

  don't like that Host has a hard reference to channels, use a callback, then wrap this top level up

  still need a limited interface passed to bots instead of this.host, especially for ~test

  no prompt after '~urban poop'

  fix weird load order (of where channels depend on host being defined)
  clean up app.js

  better folder structure

  better access to host from bots that need it (enable, help, self test), rather than hackily setting bot.host, provide limited interface

  all todos

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
*/