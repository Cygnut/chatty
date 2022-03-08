import logger from './Logger.js';
import Remote from './channels/Remote.js';
import Console from './channels/Console.js';
import Channels from './Channels.js';
import Bots from './bot/Bots.js'
import Hub from './bot/Hub.js';
import loader from './bot/Loader.js';
import config from './Config.js';

(async () => {
  const hub = new Hub({
    channels: new Channels([
      new Remote(config.channels.remote.url),
      new Console()
    ]),
    bots: new Bots(await loader())
  }).listen();

  (config.startup?.messages || []).forEach(message => {
    hub.onMessage({ from: '@startup', content: message })
  });
})();


/*
  handle all todos present in code

  Set appPath globally in app.js (but Config.js depends on it being set before then?)

  better error handling for config.json, and enforce structure.

  better folder structure

  Store enabled state of each bot persistently.

  would be nice, but doesn't need doing:
    trusted access to e.g. context.onNewMessage
*/