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

// Get booking details by ID (Standard User)
router.get('/:id', protect, restrictTo('user'), getBookingDetails);

// Cancel a booking (Standard User)
router.delete('/:id', protect, restrictTo('user'), cancelBooking);

module.exports = router;
