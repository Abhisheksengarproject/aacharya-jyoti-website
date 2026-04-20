const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins with a name
    socket.on('user:join', (userData) => {
      onlineUsers.set(socket.id, userData);
      socket.emit('chat:history', []); // future: load from DB
      io.emit('users:online', onlineUsers.size);
      console.log(`👤 User joined: ${userData.name}`);
    });

    // Admin joins
    socket.on('admin:join', () => {
      socket.join('admin-room');
      socket.emit('users:online', onlineUsers.size);
      console.log('👑 Admin connected');
    });

    // Client sends a message
    socket.on('chat:message', (data) => {
      const message = {
        id: Date.now(),
        text: data.text,
        sender: data.sender || 'Visitor',
        senderType: 'user',
        timestamp: new Date().toISOString(),
        socketId: socket.id,
      };

      // Send to admin room
      io.to('admin-room').emit('chat:message', message);
      // Echo back to the sender
      socket.emit('chat:message', { ...message, senderType: 'user' });
    });

    // Admin replies to a specific user
    socket.on('admin:reply', (data) => {
      const reply = {
        id: Date.now(),
        text: data.text,
        sender: 'Jyotishi Devi',
        senderType: 'admin',
        timestamp: new Date().toISOString(),
      };

      // Send to the specific user
      io.to(data.targetSocketId).emit('chat:message', reply);
      // Broadcast to admin room too
      io.to('admin-room').emit('chat:message', { ...reply, targetSocketId: data.targetSocketId });
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      socket.broadcast.emit('typing:update', { isTyping: true, name: data.name });
    });
    socket.on('typing:stop', () => {
      socket.broadcast.emit('typing:update', { isTyping: false });
    });

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(socket.id);
      io.emit('users:online', onlineUsers.size);
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
