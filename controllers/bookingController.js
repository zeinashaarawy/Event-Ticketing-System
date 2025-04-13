// controllers/bookingController.js

const Event = require('../models/Event');
const Booking = require('../models/Booking');

const bookTickets = async (req, res, next) => {
  const { eventId, quantity } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }

    if (event.ticketsAvailable < quantity) {
      const error = new Error('Not enough tickets available');
      error.statusCode = 400; // Bad request
      throw error;
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
    next(error); // Pass error to error handler
  }
};

module.exports = { bookTickets };
