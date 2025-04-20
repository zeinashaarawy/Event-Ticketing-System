const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authentication');
const {
  bookTickets,
  getBookingDetails,
  cancelBooking,
} = require('../controllers/bookingController');

// Book tickets
router.post('/', protect, authorizeRoles('user'), bookTickets);


// Get booking details by ID
router.get('/:id', protect, authorizeRoles('user'), getBookingDetails);

// Cancel a booking
router.delete('/:id', protect, authorizeRoles('user'), cancelBooking);

module.exports = router;
