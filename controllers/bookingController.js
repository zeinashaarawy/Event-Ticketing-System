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

module.exports = { bookTickets };
