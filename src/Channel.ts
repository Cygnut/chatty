export type Message = {
  from: string,
  content: string
}

export type OnNewMessage = (message: Message) => void;

export class Channel {
  #onNewMessage: OnNewMessage|undefined;

  setOnNewMessage(onNewMessage: OnNewMessage) {
    this.#onNewMessage = onNewMessage
  }

  get onNewMessage(): OnNewMessage {
    // We expose onNewMessage to client code through a getter so that we can indicate that
    // this.#onNewMessage is not null with the as operator, as we know better than TypeScript
    // here.
    return this.#onNewMessage as OnNewMessage;
  }

  listen() {
  }

  send(message: Message) {
  }
}