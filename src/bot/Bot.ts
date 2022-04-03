import logger from '../Logger.js';
import { Options, Context, PublicMessage, DirectMessage } from './Bot.d.js';

class Bot {
  static PREFIX = '~';

  name: string;
  description: string;
  disableable: boolean;    // Indicates ability to be disabled. True by default
  enabled: boolean;
  #context: Context|null = null;

  constructor({ name, description, disableable }: Options) {
    this.name = `${Bot.PREFIX}${name}`;
    this.description = description;
    this.disableable = disableable === undefined ? true : disableable;
    this.enabled = true;
  }

  set context(context: Context) {
    this.#context = context;
  }

  get context(): Context {
    // We expose context to client code through a getter so that we can indicate that
    // this.#context is not null with the as operator, as we know better than TypeScript
    // here.
    return this.#context as Context;
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
