const express = require('express');
const router = express.Router();

const {
  registerUser,
  login,
  forgetPassword,
  verifyOtpAndResetPassword,
} = require('../controllers/authController');

// Route: Register new user
router.post('/register', registerUser);

// Route: Login user
router.post('/login', login);

// Route: Send OTP for password reset
router.put('/forgetPassword', forgetPassword);

// Route: Verify OTP and reset password
router.put('/verifyOtpAndResetPassword', verifyOtpAndResetPassword);

module.exports = router;

