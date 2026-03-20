const { uploadImage } = require('../services/cloudinary');
const { successResponse, errorResponse } = require('../utils/response');
const fs = require('fs');
const util = require('util');
const path = require('path');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

const upload = async (request, reply) => {
  try {
    const data = await request.file();
    if (!data) return reply.status(400).send(errorResponse('No file uploaded'));

    // Save temporary file
    const tempPath = path.join(__dirname, '../../uploads', `${Date.now()}_${data.filename}`);
    if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../../uploads'));
    }

    await pump(data.file, fs.createWriteStream(tempPath));

    // Upload to Cloudinary
    const imageUrl = await uploadImage(tempPath);

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return successResponse({ imageUrl }, 'Image uploaded successfully');
  } catch (error) {
    console.error('Upload Error:', error);
    return reply.status(500).send(errorResponse(error.message));
  }
};

module.exports = { upload };
