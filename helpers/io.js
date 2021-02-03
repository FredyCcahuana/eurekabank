var io = null;

module.exports = {
  init(server) {
    if (io) return;

    io = require('socket.io')(server, {
      origins: '*:*'
    });

    io.on('connection', function (socket) {
      console.log('a user connected');
    });
  },

  emit(topic, msg) {
    return io.emit(topic, msg);
  },

};
