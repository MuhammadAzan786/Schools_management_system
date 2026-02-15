const sendSuccess = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null
  });
};

const sendSuccessWithCount = (res, statusCode, data, count, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    count,
    data
  });
};

const sendSuccessWithPagination = (res, statusCode, data, pagination, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    pagination,
    data
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendSuccessWithCount,
  sendSuccessWithPagination
};
