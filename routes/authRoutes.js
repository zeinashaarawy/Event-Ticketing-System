const express = require('express');
const router = express.Router();
const { registerUser, login, forgetPassword, verifyOtpAndResetPassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authentication');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', login);

// Forgot password (fix route and method)
router.put('/forgot-password', forgetPassword);

// Reset password with OTP (add POST route)
router.post('/reset-password', verifyOtpAndResetPassword);

// Verify OTP and reset password (legacy or alternative route)
// router.put('/verifyOtpAndResetPassword', verifyOtpAndResetPassword);

// Get current user info (protected)
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
