require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const { registerSocket, setFastify } = require('./sockets/socketManager');

// Plugins
fastify.register(require('@fastify/cors'), {
  origin: '*', // For development, customize for production
});

fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'supersecret'
});

fastify.register(require('@fastify/multipart'));

fastify.register(require('@fastify/static'), {
  root: require('path').join(__dirname, '../public'),
  prefix: '/public/', // optional: default '/'
});

fastify.register(require('@fastify/websocket'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Socket Manager Initialization
setFastify(fastify);

// WebSocket Route
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    // Basic auth check for socket (optional but recommended)
    // We'll handle registration in a 'join' type message if needed, 
    // or just pass a userId in query params for this mock/demo
    const userId = req.query.userId;
    if (userId) {
      registerSocket(userId, connection);
    } else {
      connection.socket.send(JSON.stringify({ error: 'userId required to join' }));
      connection.socket.close();
    }
  });
});

// Routes
fastify.register(require('./routes/authRoutes'), { prefix: '/auth' });
fastify.register(require('./routes/foodRoutes'), { prefix: '/foods' });
fastify.register(require('./routes/shopRoutes'), { prefix: '/shops' });
fastify.register(require('./routes/requestRoutes'), { prefix: '/requests' });
fastify.register(require('./routes/uploadRoutes'), { prefix: '/upload' });

// Health Check & Documentation
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html');
});

// Start Server
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
