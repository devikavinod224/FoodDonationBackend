let fastifyInstance = null;
const userSockets = new Map(); // userId -> socketId

const setFastify = (instance) => {
  fastifyInstance = instance;
};

const registerSocket = (userId, connection) => {
  userSockets.set(userId, connection);
  console.log(`Socket registered for user: ${userId}`);
  
  connection.socket.on('close', () => {
    userSockets.delete(userId);
    console.log(`Socket disconnected for user: ${userId}`);
  });
};

const emitToUser = (userId, event, data) => {
  const connection = userSockets.get(userId);
  if (connection && connection.socket.readyState === 1) { // 1 = OPEN
    connection.socket.send(JSON.stringify({ event, data }));
  }
};

module.exports = { setFastify, registerSocket, emitToUser };
