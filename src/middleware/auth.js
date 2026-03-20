const { errorResponse } = require('../utils/response');

const authMiddleware = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send(errorResponse('Unauthorized: Invalid or missing token'));
  }
};

const roleMiddleware = (roles) => {
  return async (request, reply) => {
    const { role } = request.user;
    if (!roles.includes(role)) {
      return reply.status(403).send(errorResponse('Forbidden: You do not have permission for this action'));
    }
  };
};

module.exports = { authMiddleware, roleMiddleware };
