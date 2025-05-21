  const express = require('express');
const router = express.Router();
const { registerUser, login, forgetPassword, verifyOtpAndResetPassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authentication');

const { registerUser, login , forgetPassword} = require('../controllers/authController');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', login);

router.put('/forgetPassword', forgetPassword);


// Verify OTP and reset password
router.put('/verifyOtpAndResetPassword', verifyOtpAndResetPassword);

// Get current user info (protected)
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});


module.exports = router;
