const AppError = require('../utils/appError');

// Middleware to restrict access based on user roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = restrictTo;