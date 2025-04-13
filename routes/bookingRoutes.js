const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  bookTickets,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
} = require('../controllers/bookingController');

router.post('/', protect, restrictTo('user'), bookTickets);

router.get('/users/bookings', protect, restrictTo('user'), getUserBookings);

router.get('/:id', protect, restrictTo('user'), getBookingDetails);

router.delete('/:id', protect, restrictTo('user'), cancelBooking);

module.exports = router;
