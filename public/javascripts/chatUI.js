const Chat = require('./chat');

function ChatUI(socket) {
  this.chat = new Chat(socket);
  this.form = document.querySelector('form');
  this.input = document.querySelector('input ');
  this.msgList = document.querySelector('ul#msg-list');
  this.submitHandler();
}

ChatUI.prototype.getInput = function () {
  return this.input.value;
};

ChatUI.prototype.sendMessage = function (msg) {
  this.chat.sendMessage(msg);
};

ChatUI.prototype.addMessage = function (msg) {
  const newMessage = document.createElement('li');
  newMessage.textContent = msg;
  this.msgList.appendChild(newMessage);
};

ChatUI.prototype.processUserInput = function () {
  const msg = this.getInput();
  console.log(msg);
  this.sendMessage(msg);
  this.addMessage(msg);
};

ChatUI.prototype.submitHandler = function () {
  this.form.addEventListener('submit', (e) => {
    e.preventDefault();
    this.processUserInput();
    this.input.value = '';
  });
};

module.exports = ChatUI;
