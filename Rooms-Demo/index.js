const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const userRoomMap = new Map();

var count = 1;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', async (socket) => {
  const sessionID = socket.id;
  count++;
  console.log(sessionID.toString() + ' user connected');

  /*
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  */

  // You should check if the room ID already exist
  socket.on('join room', (roomID) => {
    if (userRoomMap.has(sessionID)) {
      try {
        console.log(sessionID.toString() + " left " + userRoomMap.get(sessionID));
        socket.leave(userRoomMap.get(sessionID));
        socket.to(userRoomMap.get(sessionID)).emit('chat message', socket.id.toString() + " has left");
        userRoomMap.delete(sessionID);
      } catch(e) {
        console.log('[error]', 'leave room :', e);
        socket.emit('error', 'couldnt perform requested action');
      }
    }

    try {
      console.log(sessionID.toString() + " Joined " +  roomID);
      socket.join(roomID);
      socket.to(roomID).emit('chat message', socket.id.toString() + " has joined");
      userRoomMap.set(sessionID, roomID);
    } catch(e) {
      console.log('[error]', 'join room :', e);
      socket.emit('error', 'couldnt perform requested action');
    }
  });

  // You can implement it such that client can manually disconnect
  socket.on('disconnect', function() {  
    try {
      console.log(sessionID.toString() + " left " + userRoomMap.get(sessionID));
      socket.leave(userRoomMap.get(sessionID));
      socket.to(userRoomMap.get(sessionID)).emit('chat message', socket.id.toString() + " has left");
      userRoomMap.delete(sessionID);
    } catch(e) {
      console.log('[error]', 'leave room :', e);
      socket.emit('error', 'couldnt perform requested action');
    }
  });

  socket.on('chat message', (msg) => {
    console.log(userRoomMap.get(sessionID) + ": " + msg);
    io.to(userRoomMap.get(sessionID)).emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
