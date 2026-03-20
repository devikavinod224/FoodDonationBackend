const cloudinary = require('cloudinary').v2;
const { errorResponse } = require('../utils/response');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file) => {
  try {
    // Assuming file is a buffer or a path from multipart
    const result = await cloudinary.uploader.upload(file, {
      folder: 'food_donation',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

module.exports = { uploadImage };
