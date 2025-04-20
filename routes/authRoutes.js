const express = require('express');
const router = express.Router();

const { registerUser, login, forgetPassword, verifyOtpAndResetPassword } = require('../controllers/authController');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', login);


// Forget password - send OTP
router.put('/forgetPassword', forgetPassword);

// Verify OTP and reset password
router.put('/verifyOtpAndResetPassword', verifyOtpAndResetPassword);

module.exports = router;
