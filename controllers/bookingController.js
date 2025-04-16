const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Book tickets for an event
const bookTickets = async (req, res) => {
  const { eventId, quantity } = req.body;

  if (!eventId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid event ID or quantity' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

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

    event.ticketsAvailable -= quantity;

    await Promise.all([event.save(), booking.save()]);

    res.status(201).json({
      message: 'Booking confirmed',
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Error booking tickets', error: error.message });
  }
};

// Get current user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

module.exports = {
  bookTickets,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
};
