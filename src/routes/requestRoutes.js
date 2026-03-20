const { createRequest, getReceiverRequests, getShopkeeperRequests, updateRequestStatus } = require('../controllers/requestController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

async function requestRoutes(fastify, options) {
  fastify.register(async function (protectedRoutes) {
    protectedRoutes.addHook('preHandler', authMiddleware);

    // Receiver actions
    protectedRoutes.post('/', { preHandler: [roleMiddleware(['receiver'])] }, createRequest);
    protectedRoutes.get('/receiver', { preHandler: [roleMiddleware(['receiver'])] }, getReceiverRequests);

    // Shopkeeper actions
    protectedRoutes.get('/shopkeeper', { preHandler: [roleMiddleware(['shopkeeper'])] }, getShopkeeperRequests);
    protectedRoutes.post('/:id/accept', { preHandler: [roleMiddleware(['shopkeeper'])] }, (req, reply) => updateRequestStatus(req, reply, 'accepted'));
    protectedRoutes.post('/:id/reject', { preHandler: [roleMiddleware(['shopkeeper'])] }, (req, reply) => updateRequestStatus(req, reply, 'rejected'));
  });
}

module.exports = requestRoutes;
