import logger from '../Logger';
import { Options, Context, PublicMessage, DirectMessage } from './Bot.d';

class Bot {
  static PREFIX = '~';

  name: string;
  description: string;
  disableable: boolean;    // Indicates ability to be disabled. True by default
  enabled: boolean;
  context: Context|null = null;

  constructor({ name, description, disableable }: Options) {
    this.name = `${Bot.PREFIX}${name}`;
    this.description = description;
    this.disableable = disableable === undefined ? true : disableable;
    this.enabled = true;
  }

  setContext(context: Context) {
    this.context = context;
  }

  enable(on: boolean) {
    // If we're not allowed to disable this bot, then we're done.
    if (!on && !this.disableable)
      return;

    logger.info(`${on ? 'Enabling' : 'Disabling'} ${this.name}`);

    this.enabled = on;
  }

  getTests(): string[] {
    return [];
  }

  async onPublicMessage({ content, from }: PublicMessage) {}

  async onDirectMessage({ content, from }: DirectMessage) {}
}

export default Bot;
