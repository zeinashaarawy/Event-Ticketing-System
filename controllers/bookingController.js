exports.bookTickets = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const event = await Event.findById(eventId);
    if (!event || event.status !== 'approved') {
      return res.status(404).json({ error: 'Event not found or not approved' });
    }
    if (event.availableTickets < quantity) {
      return res.status(400).json({ error: 'Insufficient tickets' });
    }
    event.availableTickets -= quantity;
    await event.save();
    const totalPrice = quantity * event.ticketPrice;
    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      quantity,
      totalPrice,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const event = await Event.findById(booking.event);
    event.availableTickets += booking.quantity;
    await event.save();
    await booking.remove();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
