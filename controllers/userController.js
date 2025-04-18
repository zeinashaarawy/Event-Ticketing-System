const User = require('../models/user');
const Event = require('../models/Event')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const oldRole = user.role;
    const newRole = req.body.role;

    console.log('Old Role:', oldRole);
    console.log('New Role (from body):', newRole);

    if (!newRole) {
      return res.status(400).json({ message: 'No role provided' });
    }

    user.role = newRole;
    await user.save();

    console.log('Saved Role:', user.role);

    res.json({
      message: `User role updated from '${oldRole}' to '${newRole}'`,
      user
    });
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Forget password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getOrganizerEvents = async (req, res) => {
  try {
    
    const organizerId = req.user.id; 
    const events = await Event.find({ organizer: organizerId }); 
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for this organizer' });
    }

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events',
      error: error.message,
    });
  }
};

const getEventAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const events = await Event.find({ organizer: organizerId });

    if (!events || events.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalEvents: 0,
          totalTicketsSold: 0,
          totalRevenue: 0,
          upcomingEvents: []
        }
      });
    }

    const totalTicketsSold = events.reduce((total, event) => {
      const remaining = event.remainingTickets ?? event.ticketsAvailable; // fallback
      const sold = Math.max(event.ticketsAvailable - remaining, 0);
      return total + sold;
    }, 0);
    //total revenu = The total amount of money earned by the organizer from ticket sales
    const totalRevenue = events.reduce((total, event) => {
      const remaining = event.remainingTickets ?? event.ticketsAvailable;
      const sold = Math.max(event.ticketsAvailable - remaining, 0);
      return total + (event.ticketPrice * sold);
    }, 0);

    const upcomingEvents = events.filter(event => new Date(event.date) > new Date());

    res.status(200).json({
      success: true,
      data: {
        totalEvents: events.length,
        totalTicketsSold,
        totalRevenue,
        upcomingEvents: upcomingEvents.map(event => ({
          title: event.title,
          date: event.date,
          ticketsAvailable: event.ticketsAvailable
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics',
      error: error.message,
    });
  }
};







module.exports = {
  registerUser,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  forgetPassword,
  getOrganizerEvents, 
  getEventAnalytics
};
