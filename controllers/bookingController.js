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

// Get booking details by ID
const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get booking details', error: error.message });
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
  cancelBooking,
  getBookingDetails
};
