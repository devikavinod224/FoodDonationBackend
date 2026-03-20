const Request = require('../models/Request');
const Food = require('../models/Food');
const Shop = require('../models/Shop');
const { successResponse, errorResponse } = require('../utils/response');
const { emitToUser } = require('../sockets/socketManager');

const createRequest = async (request, reply) => {
  try {
    const { foodId, requestedQty } = request.body;
    const receiverId = request.user.id;
    const receiverName = request.user.name; // Assuming name is in token or fetch it

    const food = await Food.findById(foodId);
    if (!food) return reply.status(404).send(errorResponse('Food item not found'));

    if (food.quantity < requestedQty) {
      return reply.status(400).send(errorResponse(`Insufficient quantity. Only ${food.quantity} portions available.`));
    }

    const shop = await Shop.findById(food.shopId);
    
    const newRequest = new Request({
      foodId,
      foodName: food.name,
      foodImage: food.imageUrl,
      requestedQty,
      receiverId,
      receiverName: request.user.name || 'Anonymous',
      shopkeeperId: shop.shopkeeperId,
      shopId: shop._id,
      shopName: shop.name,
      status: 'pending'
    });

    await newRequest.save();

    // Emit real-time event to shopkeeper
    emitToUser(shop.shopkeeperId.toString(), 'newRequest', { request: newRequest });

    return successResponse(newRequest, 'Food request submitted successfully');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const getReceiverRequests = async (request, reply) => {
  try {
    const receiverId = request.user.id;
    const requests = await Request.find({ receiverId }).sort({ createdAt: -1 });
    return successResponse(requests);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const getShopkeeperRequests = async (request, reply) => {
  try {
    const shopkeeperId = request.user.id;
    const requests = await Request.find({ shopkeeperId }).sort({ createdAt: -1 });
    return successResponse(requests);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const updateRequestStatus = async (request, reply) => {
  try {
    const { id, status } = request.params; // status from route params or body
    const reqStatus = status || request.body.status;

    const foodRequest = await Request.findById(id);
    if (!foodRequest) return reply.status(404).send(errorResponse('Request not found'));

    if (reqStatus === 'accepted') {
      const food = await Food.findById(foodRequest.foodId);
      if (food.quantity < foodRequest.requestedQty) {
        return reply.status(400).send(errorResponse('Cannot accept: available quantity is now less than requested.'));
      }
      // Reduce quantity
      food.quantity -= foodRequest.requestedQty;
      await food.save();
    }

    foodRequest.status = reqStatus;
    await foodRequest.save();

    // Emit real-time event to receiver
    emitToUser(foodRequest.receiverId.toString(), 'requestUpdate', { 
      requestId: foodRequest._id, 
      status: reqStatus 
    });

    return successResponse(foodRequest, `Request ${reqStatus} successfully`);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

module.exports = { createRequest, getReceiverRequests, getShopkeeperRequests, updateRequestStatus };
