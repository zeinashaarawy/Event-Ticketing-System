const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');


// Book tickets for an event
const bookTickets = async (req, res) => {
  const { eventId, quantity } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = event.ticketPrice * quantity;
    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      quantity,
      totalPrice,
    });

    event.ticketsAvailable -= quantity; // Update event ticket availability
    await event.save();
    await booking.save();

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error booking tickets', error });
  }
};

const getUserBookings = async (req, res) => {
  try {
    // Find all bookings for the current user (using req.user.id)
    const bookings = await Booking.find({ user: req.user.id }).populate('event');

    // If no bookings are found
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    // Send the list of bookings as the response
    res.status(200).json({ bookings });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
};

// Get booking details by ID
const getBookingDetails = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Check if the booking ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Fetch booking details by ID and user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,  // Ensures the user is the one making the request
    }).populate('event');  // Populate event details if needed

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Return the booking details
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get booking details',
      error: error.message,
    });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }

    const event = await Event.findById(booking.event);
    if (event) {
      event.availableTickets += booking.quantity;
      await event.save();
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

module.exports = {
  bookTickets,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
};
