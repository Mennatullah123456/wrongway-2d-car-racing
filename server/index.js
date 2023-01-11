const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const uuid = require('uuid/v4');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const players = {};
const enemies = {};
const chatMessages = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  const playerId = uuid();
  players[playerId] = {
    x: Math.random() * 800,
    y: Math.random() * 600,
  };
  socket.emit('player-update', players[playerId]);
  socket.emit('players-update', players);
  socket.emit('enemies-update', enemies);
  socket.emit('chat-message', {
    id: uuid(),
    username: 'Server',
    message: `Welcome to Wrong Way Racer, ${playerId}!`,
  });
  chatMessages.push({
    id: uuid(),
    username: 'Server',
    message: `${playerId} has joined the game.`,
  });
  socket.broadcast.emit('chat-message', chatMessages[chatMessages.length - 1]);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete players[playerId];
    chatMessages.push({
      id: uuid(),
      username: 'Server',
      message: `${playerId} has left the game.`,
    });
    socket.broadcast.emit('chat-message', chatMessages[chatMessages.length - 1]);
  });

  socket.on('player-update', (playerData) => {
    players[playerId] = playerData;
    socket.broadcast.emit('players-update', players);
  });

  socket.on('chat-message', (message) => {
    message.id = uuid();
    message.username = playerId;
    chatMessages.push(message);
    socket.broadcast.emit('chat-message', message);
  });
});

setInterval(() => {
  const enemyId = uuid();
  enemies[enemyId] = {
    x: Math.random() * 800,
    y: Math.random() * 600,
  };
  io.emit('enemies-update', enemies);
  setTimeout(() => {
    delete enemies[enemyId];
    io.emit('enemies-update', enemies);
  }, 10000);
}, 5000);

server.listen(3000, () => {
  console.log('listening on *:3000');
});

