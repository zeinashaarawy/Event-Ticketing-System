const express = require('express');
const router = express.Router();

const { registerUser, login , forgetPassword} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', login);

router.put('/forgetPassword', forgetPassword);

module.exports = router;
