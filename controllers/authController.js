const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../utils/emailService');

// Store OTPs temporarily with expiration (replace with Redis in production)
const otpStore = new Map();

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

    console.log('Attempt login for:', email);
    console.log('User found:', user ? true : false);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
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

// Forget password with OTP
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { 
      digits: true, 
      upperCase: false, 
      specialChars: false,
      alphabets: false 
    });

    // Store OTP with 5-minute expiration
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Send OTP via email
    const emailResult = await sendEmail(
      email,
      'Password Reset OTP',
      `Your OTP for password reset is: ${otp}\nThis OTP will expire in 5 minutes.`
    );

    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.status(200).json({ 
      message: 'OTP sent to your email',
      previewUrl: emailResult.previewUrl // For testing purposes
    });
  } catch (err) {
    console.error('Forget password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // Check OTP expiration
    if (Date.now() > storedOTP.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear OTP after successful password reset
    otpStore.delete(email);

    // Send confirmation email
    await sendEmail(
      email,
      'Password Reset Successful',
      'Your password has been successfully reset.'
    );

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user
const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  login,
  forgetPassword,
  verifyOtpAndResetPassword,
  logout
};
