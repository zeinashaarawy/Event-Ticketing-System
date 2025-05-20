const express = require('express');
const router = express.Router();
const { registerUser, login, forgetPassword, verifyOtpAndResetPassword, logout } = require('../controllers/authController');


// User registration
router.post('/register', registerUser);

// User login
router.post('/login', login);

// User logout
router.post('/logout', logout);


// Forget password - send OTP
router.put('/forgetPassword', forgetPassword);

// Verify OTP and reset password
router.put('/verifyOtpAndResetPassword', verifyOtpAndResetPassword);

// Get current user info (placeholder implementation)
router.get('/me', (req, res) => {
  // TODO: Replace with real authentication/user lookup logic
  res.json({ message: 'User info endpoint working!' });
});

module.exports = router;
