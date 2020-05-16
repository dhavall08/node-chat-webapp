const users = [];

function addUser({ id, username, room }) {
  username = username && username.trim().toLowerCase();
  room = room && room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: 'Username and room are required.'
    }
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username == username
  });

  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  const user = { id, username, room }
  users.push(user);
  return { user }
}

function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUser(id) {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return {
      error: 'No such user is available.'
    }
  }
  return user;
}

function getUsersInRoom(room) {
  room = room && room.trim().toLowerCase();
  const usersList = users.filter((user) => user.room === room);
  return usersList;
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}