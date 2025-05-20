const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
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
