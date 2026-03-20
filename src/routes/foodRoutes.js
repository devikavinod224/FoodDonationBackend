const { createFood, getMyFoods, getAllFoods, updateFood, deleteFood } = require('../controllers/foodController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

async function foodRoutes(fastify, options) {
  // Public (Receiver browsing)
  fastify.get('/', getAllFoods);

  // Protected
  fastify.register(async function (protectedRoutes) {
    protectedRoutes.addHook('preHandler', authMiddleware);

    // Shopkeeper specific
    protectedRoutes.post('/', { preHandler: [roleMiddleware(['shopkeeper'])] }, createFood);
    protectedRoutes.get('/my', { preHandler: [roleMiddleware(['shopkeeper'])] }, getMyFoods);
    protectedRoutes.put('/:id', { preHandler: [roleMiddleware(['shopkeeper'])] }, updateFood);
    protectedRoutes.delete('/:id', { preHandler: [roleMiddleware(['shopkeeper'])] }, deleteFood);
  });
}

module.exports = foodRoutes;
