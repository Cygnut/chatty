import logger from './Logger';
import Remote from './channels/Remote';
import Console from './channels/Console';
import Channels from './Channels';
import Bots from './bot/Bots'
import Hub from './bot/Hub';
import loader from './bot/Loader';
import config from './Config';

(async () => {
  const hub = new Hub({
    channels: new Channels([
      new Remote(config.channels?.remote?.url),
      new Console()
    ]),
    bots: new Bots(await loader())
  }).listen();

  (config.startup?.messages || []).forEach((content: string) => {
    hub.onMessage({ from: '@startup', content })
  });
})();


/*
  put interface definitions in the correct place

  check logging still works after being passed separately

  better folder structure

  typescript & eslinting & formatting
    type for config structure

  Store enabled state of each bot persistently.

  ongoing:
    handle all todos present in code

    would be nice, but doesn't need doing:
    trusted access to e.g. context.onNewMessage
*/