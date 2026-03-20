const Food = require('../models/Food');
const Shop = require('../models/Shop');
const { successResponse, errorResponse } = require('../utils/response');

const createFood = async (request, reply) => {
  try {
    const { name, category, quantity, imageUrl, description } = request.body;
    const userId = request.user.id;

    const shop = await Shop.findOne({ shopkeeperId: userId });
    if (!shop) return reply.status(404).send(errorResponse('Shop not found. Please create a shop first.'));

    const newFood = new Food({
      name,
      category,
      quantity,
      imageUrl,
      description,
      shopId: shop._id,
      shopName: shop.name
    });

    await newFood.save();
    return successResponse(newFood, 'Food item added successfully');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const getMyFoods = async (request, reply) => {
  try {
    const userId = request.user.id;
    const shop = await Shop.findOne({ shopkeeperId: userId });
    if (!shop) return successResponse([], 'No shop found');

    const foods = await Food.find({ shopId: shop._id }).sort({ createdAt: -1 });
    return successResponse(foods);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const getAllFoods = async (request, reply) => {
  try {
    const { category } = request.query;
    const filter = category ? { category } : {};
    const foods = await Food.find(filter).sort({ createdAt: -1 });
    return successResponse(foods);
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const updateFood = async (request, reply) => {
  try {
    const { id } = request.params;
    const updatedFood = await Food.findByIdAndUpdate(id, request.body, { new: true });
    if (!updatedFood) return reply.status(404).send(errorResponse('Food not found'));
    return successResponse(updatedFood, 'Food item updated successfully');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const deleteFood = async (request, reply) => {
  try {
    const { id } = request.params;
    await Food.findByIdAndDelete(id);
    return successResponse({}, 'Food item deleted successfully');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

module.exports = { createFood, getMyFoods, getAllFoods, updateFood, deleteFood };
