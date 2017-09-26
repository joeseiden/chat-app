const io = require('socket.io');

let chat;
let numGuests = 1;

const nicknames = {};
let namesUsed = [];

const chatServer = {
  handleMessageBroadcast (socket) {
    socket.on('message',(message) => {
      console.log(message);
      socket.emit('message', {
        text: `${message.text}`
      });
    }
    );
  },
  listen(server) {
    chat = io(server);

    chat.on('connection', (socket) => {
      console.log('connected');
      this.handleMessageBroadcast(socket);
    });
  }
};

module.exports = chatServer;
