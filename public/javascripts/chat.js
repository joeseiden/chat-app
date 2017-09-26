function Chat (socket) {
  this.socket = socket;
}

Chat.prototype.sendMessage = function (msg) {
  this.socket.emit('message', {text: msg});
};

module.exports = Chat;
