const Shop = require('../models/Shop');
const { successResponse, errorResponse } = require('../utils/response');

const createOrUpdateShop = async (request, reply) => {
  try {
    const userId = request.user.id;
    const { name, description, imageUrl, location } = request.body;

    const shopData = {
      shopkeeperId: userId,
      name,
      description,
      imageUrl,
      location: {
        ...location,
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    };

    const shop = await Shop.findOneAndUpdate(
      { shopkeeperId: userId },
      shopData,
      { upsert: true, new: true }
    );

    return successResponse(shop, 'Shop profile updated successfully');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const getMyShop = async (request, reply) => {
  try {
    const userId = request.user.id;
    const shop = await Shop.findOne({ shopkeeperId: userId });
    if (!shop) return reply.status(404).send(errorResponse('Shop not found'));
    return successResponse(shop);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const getNearbyShops = async (request, reply) => {
  try {
    const { lat, lng, radius = 5000 } = request.query; // Default 5km radius
    
    const shops = await Shop.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    return successResponse(shops);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

module.exports = { createOrUpdateShop, getMyShop, getNearbyShops };
