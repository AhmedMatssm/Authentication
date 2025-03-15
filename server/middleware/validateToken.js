const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../Models/userModel');

exports.validateToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decod = jwt.decode(token);
    if (new Date().getTime() < decod.exp * 1000) {
      try {
        // 2) Verification of token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3) Check if user still exists
        console.log('yes');
        const currentUser = await User.findById(decoded.id);

        console.log(currentUser);

        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist', 401));
        }
        // 4) Check if user changed password after the JWT was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        }

        // 5) Everything Ok, GRANT ACCESS

        next();
      } catch (e) {
        return next(new AppError('Invalid Token.', 401));
      }
    } else {
      return res.status(401).json({
        resp: false,
        message: 'Token expanded'
      });
    }
  } catch (e) {
    return next(new AppError('Invalid Token.', 401));
  }
};
