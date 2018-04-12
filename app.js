var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.sockets = {}
app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});
io.on('connection', function (socket) {
  const socketId = socket.id
  app.sockets[socketId] = socket.id
  io.to(socketId).emit('socket.id.received', {id: socketId})
  io.sockets.emit('socket.list', {sockets: app.sockets});
  socket.on('disconnect', (reason) => {
    const socketId = socket.id
    app.sockets[socketId] = undefined
    io.sockets.emit('socket.list', {sockets: app.sockets});
  });
});
module.exports = server

