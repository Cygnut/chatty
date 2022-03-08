class Channel {
  onNewMessage;

  setOnNewMessage(onNewMessage) {
    this.onNewMessage = onNewMessage
  }

  receive() {
  }

  send({ from, content }) {
  }
}

export default Channel;