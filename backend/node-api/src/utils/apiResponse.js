const success = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  const response = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

const error = (res, message = 'Server Error', statusCode = 500, details = null) => {
  const response = { success: false, message };
  if (details) response.error = { details };
  return res.status(statusCode).json(response);
};

module.exports = { success, error };
