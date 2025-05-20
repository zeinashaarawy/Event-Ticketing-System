const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpGenerator = require('otp-generator');

// Store OTPs temporarily (replace with a more persistent solution like Redis for production)
let otpStore = {};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  const user = await User.create({
      name,
      email,
      password: password,
      role: role || 'user',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forget password with OTP (MFA)
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  //console.log("newPassword:", newPassword);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });

    // Store OTP temporarily (In production, use Redis or a DB with expiration)
    otpStore[email] = otp;

    res.status(200).json({ message: `OTP generated: ${otp} `});
  } catch (err) {
    console.error('Forget password error:', err);
    res.status(500).json({ message: 'Server error' });
  }

 };

// Verify OTP and reset password
async function verifyOtpAndResetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  // Check if the OTP is valid
  if (otpStore[email] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password in the database
  const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Clear OTP after password reset
  delete otpStore[email];

  res.status(200).json({ message: 'Password reset successful' });
}

module.exports = {
  registerUser,
  login,
  forgetPassword,
  verifyOtpAndResetPassword,
};
