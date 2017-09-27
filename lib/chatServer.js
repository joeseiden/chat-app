const io = require('socket.io');

let chat;
let guestNumber = 1;
let numGuests = 1;

const nicknames = {};
let namesUsed = [];

const chatServer = {
  assignGuestName (socket) {
    const name = `Guest_${guestNumber}`;
    nicknames[socket.id] = name;
    socket.emit('nameResult', {
      success: true,
      name
    });
    namesUsed.push(name);
    return guestNumber + 1;
  },
  handleNicknameChangeRequest (socket) {
    socket.on('nameAttempt', (name) => {
      if (!namesUsed.includes(name)) {
        const prevName = nicknames[socket.id];
        const prevNameIdx = namesUsed.indexOf(prevName);
        nicknames[socket.id] = name;
        namesUsed = [
          ...namesUsed.slice(0, prevNameIdx),
          ...namesUsed.slice(prevNameIdx + 1),
          name
        ];
        socket.emit('nameResult', {
          success: true,
          name
        });
        socket.broadcast.emit('message', {
          text: `${prevName} is now known as ${name}.`
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    });
  },
  handleMessageBroadcast (socket) {
    socket.on('message',(message) => {
      console.log(message);
      socket.broadcast.emit('message', {
        text: `${nicknames[socket.id]}: ${message.text}`
      });
    }
    );
  },
  handleDisconnect (socket) {
    socket.on('disconnect', () => {
      const name = nicknames[socket.id];
      const nameIdx = namesUsed.indexOf(nicknames[socket.id]);
      delete nicknames[socket.id];
      namesUsed = [
        ...namesUsed.slice(0, nameIdx),
        ...namesUsed.slice(nameIdx + 1)
      ];
      socket.emit('message', {
        text: `${name} has left the chat.`
      });
    });
  },
  listen(server) {
    chat = io(server);

    chat.on('connection', (socket) => {
      guestNumber = this.assignGuestName(socket);
      console.log('connected');
      this.handleMessageBroadcast(socket);
      this.handleNicknameChangeRequest(socket);
      this.handleDisconnect(socket);
    });
  }
};

module.exports = chatServer;
