// Import Express and authentication controller
const express = require('express');
const authController = require('./../controllers/authController');

// Import middleware for role validation
const restrictTo = require('./../middleware/validateRole');

// Create router instance
const router = express.Router();

// Routes for user authentication
router.post('/signup', authController.signupUser); // User signup route
router.post('/login', authController.login); // User login route
router.post('/logout', authController.logout); // User logout route
// router.post('/forgetPassword', authController.forgetPassword); // Forget password route
// router.post('/resetPassword/:token', authController.resetPassword); // Reset password route

// Middleware to protect routes beyond this point (require authentication)
router.use(authController.protect);

// Export router
module.exports = router;