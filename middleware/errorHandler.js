const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;