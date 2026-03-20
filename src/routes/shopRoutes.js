const { createOrUpdateShop, getMyShop, getNearbyShops } = require('../controllers/shopController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

async function shopRoutes(fastify, options) {
  // Public/Receiver
  fastify.get('/nearby', getNearbyShops);

  // Protected
  fastify.register(async function (protectedRoutes) {
    protectedRoutes.addHook('preHandler', authMiddleware);
    
    protectedRoutes.get('/my', { preHandler: [roleMiddleware(['shopkeeper'])] }, getMyShop);
    protectedRoutes.post('/', { preHandler: [roleMiddleware(['shopkeeper'])] }, createOrUpdateShop);
    protectedRoutes.put('/:id', { preHandler: [roleMiddleware(['shopkeeper'])] }, createOrUpdateShop);
  });
}

module.exports = shopRoutes;
