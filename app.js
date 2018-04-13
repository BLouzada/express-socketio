var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.sockets = {}
app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});
app.get('/emit-event', function (req, res) {
  io.sockets.emit('new.event', {newEvent: {data: 'exemplo', date: new Date().toISOString()}});
  res.end()
});
io.on('connection', function (socket) {
  const socketId = socket.id
  console.log(`Socket conectado ${socketId}`)
  app.sockets[socketId] = socket.id
  io.to(socketId).emit('socket.id.received', {id: socketId})
  io.sockets.emit('socket.list', {sockets: app.sockets});
  socket.on('disconnect', (reason) => {
    const socketId = socket.id
    console.log(`Socket desconectado ${socketId}`)
    app.sockets[socketId] = undefined
    io.sockets.emit('socket.list', {sockets: app.sockets});
  });
});
module.exports = server

