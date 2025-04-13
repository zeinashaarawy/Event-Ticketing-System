const Event = require('../models/Event');

const eventController = {
  // Create Event (Admin only)
  createEvent: async (req, res) => {
    try {
      const { title, description, date, location, price, availableTickets } = req.body;
      const event = new Event({
        title,
        description,
        date,
        location,
        price,
        availableTickets,
        createdBy: req.user.userId,
      });
      await event.save();
      res.status(201).json({ message: 'Event created', event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get All Events (Public)
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find().populate('createdBy', 'name');
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get Single Event (Public)
  getEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id).populate('createdBy', 'name');
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = eventController;
