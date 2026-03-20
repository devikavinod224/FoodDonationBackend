const { upload } = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/auth');

async function uploadRoutes(fastify, options) {
  fastify.post('/', { preHandler: [authMiddleware] }, upload);
}

module.exports = uploadRoutes;
