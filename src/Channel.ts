export type Message = {
  from: string,
  content: string
}

export type OnNewMessage = (message: Message) => void;

export class Channel {
  onNewMessage: OnNewMessage|undefined;

  setOnNewMessage(onNewMessage: OnNewMessage) {
    this.onNewMessage = onNewMessage
  }

  listen() {
  }

  send(message: Message) {
  }
}