export interface Options {
  name: string,
  description: string,
  disableable?: boolean
}

export interface Description {
  name: string,
  description: string,
  enabled: boolean,
  disableable: boolean,
  tests: string[],
}

export interface Context {
  enableBot(botName: string, on: boolean|null = null): boolean?,
  describeBots(): Description[],
  onMessage(message: Message): void,
  reply(content: string, to?: string): void
}

interface Message {
  content: string,
  from: string
}

export interface PublicMessage extends Message {}

export interface DirectMessage extends Message {}
