import logger from './Logger.js';
import Remote from './channels/Remote.js';
import Console from './channels/Console.js';
import Channels from './Channels.js';
import Host from './bot/Host.js';
import loader from './bot/Loader.js';
import config from './Config.js';

(async () => {
  new Host({
    channels: new Channels([
      new Remote(config.channels.remote.url),
      new Console()
    ]),
    bots: await loader()
  }).listen();
})();


/*
  rename host to hub
  better construction of Bots
  still need a limited interface passed to bots instead of this.host, especially for ~test

  use file logger
  handle all todos

  Set appPath globally in app.js (but Config.js depends on it being set before then?)

  separate stream for errors and content?

  better error handling in config.json, and enforce structure.

  better folder structure

  better access to host from bots that need it (enable, help, self test), rather than hackily setting bot.host, provide limited interface

  Roadmap:
    Combine.

  ChatBot:
    Store enabled state of each bot persistently.

  Finish UdpBot, and test it. It currently is not sending to the Chat.

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