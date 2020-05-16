const socket = io();

// Elements
const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const locationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscoll = () => {
  const newMessage = messages.lastElementChild;
  const newMessageHeight = newMessage.offsetHeight;
  if (messages.scrollHeight - messages.scrollTop - messages.clientHeight - newMessageHeight <= 50) {
    messages.scrollTop = messages.scrollHeight;
  }
}

socket.on('countUpdated', (count) => {
  console.log('The count has been updated!', count);
});

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    created_at: moment(message.createdAt).format('h:mm a')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscoll();
})

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    created_at: moment(message.createdAt).format('h:mm a')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscoll();
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  sidebar.innerHTML = html;
})

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  messageFormInput.setAttribute('disabled', 'disabled');
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message, (err) => {
    messageFormInput.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus()

    if (err) {
      return console.error(err);
    }
    console.log('Message delieved!');
  });
});

document.querySelector('#send-location').addEventListener('click', (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by you browser');
  }
  locationButton.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      socket.emit('sendLocation', {
        latitude, longitude
      }, () => {
        locationButton.removeAttribute('disabled');
        console.log('Location shared!');
      });
    }, (err) => {
      alert(err.message);
    });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});