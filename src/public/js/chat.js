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
  socket.emit('sendMessage', message, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Message delieved!');
  });
});

document.querySelector('#send-location').addEventListener('click', (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by you browser');
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      socket.emit('sendLocation', {
        latitude, longitude
      }, () => {
        console.log('Location shared!');
      });
    }, (err) => {
      alert(err.message);
    });
})