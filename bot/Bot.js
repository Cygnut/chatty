import logger from '../Logger.js';

class Bot {
  static PREFIX = '~';

  name;
  description;
  disableable;    // Indicates ability to be disabled. True by default
  enabled;

  constructor({ name, description, disableable }) {
    this.name = `${Bot.PREFIX}${name}`;
    this.description = description;
    this.disableable = disableable === undefined ? true : disableable;
    this.enabled = false;
  }

  enable(on) {
    // If we're not allowed to disable this bot, then we're done.
    if (!on && !this.disableable)
      return;

    logger.info(`${on ? 'Enabling' : 'Disabling'} ${this.name}`);

    this.enabled = on;
    if (this.onEnabled)
      this.onEnabled(on);
  }

  async onPublicMessage({ content, from }) {}

  async onDirectMessage({ content, from }) {}
}

export default Bot;
