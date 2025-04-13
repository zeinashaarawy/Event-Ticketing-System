const Event = require('../models/Event');

// Create a new event
const createEvent = async (req, res) => {
  const { title, description, date, location, ticketsAvailable, ticketPrice } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      ticketsAvailable,
      ticketPrice,
      status: 'pending',
      organizer: req.user.id,  // Get the organizer from the JWT payload (user ID)
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// Get event details by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEvent, getEventById };
