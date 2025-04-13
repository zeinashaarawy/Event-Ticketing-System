// controllers/eventController.js

const Event = require('../models/Event');

// Create Event
const createEvent = async (req, res, next) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      ticketsAvailable: req.body.ticketsAvailable,
      ticketPrice: req.body.ticketPrice,
      status: 'pending',
      organizer: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    next(error); // Pass error to error handler
  }
};

// Get Event by ID
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404; // Set custom status code for "Not Found"
      throw error;
    }

    res.status(200).json(event);
  } catch (error) {
    next(error); // Pass error to error handler
  }
};

module.exports = { createEvent, getEventById };
