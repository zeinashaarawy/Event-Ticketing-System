  const express = require('express');
const router = express.Router();
const { registerUser, login, forgetPassword, verifyOtpAndResetPassword, logout } = require('../controllers/authController');

const { registerUser, login , forgetPassword} = require('../controllers/authController');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', login);

router.put('/forgetPassword', forgetPassword);

module.exports = router;
