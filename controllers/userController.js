const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
          upcomingEvents: [],
          eventBookingStats: []
        }
      });
    }

    let totalTicketsSold = 0;
    let totalRevenue = 0;

    const upcomingEvents = [];
    const eventBookingStats = [];

    for (const event of events) {
      // Get total tickets sold for this event
      const bookings = await Booking.find({ event: event._id });
      const sold = bookings.reduce((sum, b) => sum + b.quantity, 0);
      const total = event.ticketsAvailable + sold; // original total
      const percentBooked = total > 0 ? (sold / total) * 100 : 0;

      totalTicketsSold += sold;
      totalRevenue += sold * event.ticketPrice;

      if (new Date(event.date) > new Date()) {
        upcomingEvents.push({
          title: event.title,
          date: event.date,
          ticketsAvailable: event.ticketsAvailable
        });
      }

      eventBookingStats.push({
        eventId: event._id,
        title: event.title,
        percentBooked
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalEvents: events.length,
        totalTicketsSold,
        totalRevenue,
        upcomingEvents,
        eventBookingStats // for your graph!
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

// Get bookings for the current user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'No bookings found for this user' });
    }

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getOrganizerEvents, 
  getEventAnalytics, 
  getUserBookings
};
