const socket = io();

socket.on('countUpdated', (count) => {
  console.log('The count has been updated!', count);
});

socket.on('message', (message) => {
  console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message);
})