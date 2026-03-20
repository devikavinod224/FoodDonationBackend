const { register, login, googleAuth } = require('../controllers/authController');

async function authRoutes(fastify, options) {
  fastify.post('/register', register);
  fastify.post('/login', login);
  fastify.post('/google', googleAuth);
}

module.exports = authRoutes;
