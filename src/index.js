const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, 'public');

app.use(express.static(publicDirectoryPath));

// sender (emit) => receiver (on)
io.on('connection', (socket) => {
  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined!');
  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  })
});

// listen from server, not app
server.listen(port, () => {
  console.log('Server is running on port', port);
});