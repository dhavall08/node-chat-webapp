const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, 'public');

app.use(express.static(publicDirectoryPath));

// sender (emit) => receiver (on)
io.on('connection', (socket) => {
  socket.emit('message', generateMessage('Welcome!'));

  socket.broadcast.emit('message', generateMessage('A new user has joined!'));

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    socket.broadcast.emit('locationMessage',
      generateLocationMessage(`https://www.google.com/maps?q=${latitude},${longitude}`));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  })
});

// listen from server, not app
server.listen(port, () => {
  console.log('Server is running on port', port);
});