const express = require('express');
const router = express.Router();
const {
  bookTickets,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authentication');

// Book tickets (Standard User)
router.post('/', protect, restrictTo('user'), bookTickets);

// Get current user's bookings (Standard User)
router.get('/users/bookings', protect, restrictTo('user'), getUserBookings);

module.exports = router;
