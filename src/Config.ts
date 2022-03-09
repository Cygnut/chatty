
import path from 'path';
import { readFileSync } from 'fs';

import appPath from './AppPath';

interface Startup {
  messages: string[]
}

interface RemoteChannel {
  url: string
}

interface Channels {
  remote?: RemoteChannel,
}

interface GoodreadsBot {
  name: string,
  settings: {
    apiKey: string
  }
} 

type Bots = Array<GoodreadsBot>

interface Config {
  startup?: Startup,
  channels: Channels,
  bots: Bots
}

const filepath = path.join(appPath, 'config.json');
const content = readFileSync(filepath);
const config: Config = JSON.parse(content.toString());

export default config;