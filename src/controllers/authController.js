const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (request, reply) => {
  try {
    const { name, email, password, role, location } = request.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return reply.status(400).send(errorResponse('Email already registered'));

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location: location || { lat: 0, lng: 0, address: '', type: 'Point', coordinates: [0, 0] }
    });

    await newUser.save();

    const token = await reply.jwtSign({ id: newUser._id, role: newUser.role });
    
    // Remove password from response
    const userObj = newUser.toObject();
    delete userObj.password;

    return successResponse({ token, role: newUser.role, user: userObj }, 'Registration successful');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const login = async (request, reply) => {
  try {
    const { email, password } = request.body;
    
    const user = await User.findOne({ email });
    if (!user) return reply.status(400).send(errorResponse('Invalid credentials'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return reply.status(400).send(errorResponse('Invalid credentials'));

    const token = await reply.jwtSign({ id: user._id, role: user.role });
    
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse({ token, role: user.role, user: userObj }, 'Login successful');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

const googleAuth = async (request, reply) => {
  try {
    const { googleId, name, email, role } = request.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        password: 'google_auth_placeholder',
        googleId,
        role: role || 'receiver',
      });
      await user.save();
    }

    const token = await reply.jwtSign({ id: user._id, role: user.role });
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse({ token, role: user.role, user: userObj }, 'Google authentication successful');
  } catch (error) {
    return reply.status(500).send(errorResponse(error.message));
  }
};

module.exports = { register, login, googleAuth };
