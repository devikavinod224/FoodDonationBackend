const successResponse = (data, message = null) => {
  return {
    success: true,
    data: data || {},
    message: message || undefined
  };
};

const errorResponse = (message) => {
  return {
    success: false,
    message: message || 'An error occurred'
  };
};

module.exports = { successResponse, errorResponse };
