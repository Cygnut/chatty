class Channel {
  onNewMessage;

  setOnNewMessage(onNewMessage) {
    this.onNewMessage = onNewMessage
  }

  listen() {
  }

  send({ from, content }) {
  }
}

export default Channel;