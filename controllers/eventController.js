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


const getApprovedEvents = async (req, res) => {
  try {
    const approvedEvents = await Event.find({ status : 'approved' });

    res.status(200).json({
      success: true,
      count: approvedEvents.length,
      data: approvedEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved events',
      error: error.message
    });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
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

// Update event details
const updateEvent = async (req, res) => {
  const { title, description, date, location, ticketsAvailable, ticketPrice, status } = req.body;

  try {
    // Find the event by its ID
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Optional: Check if the user is the organizer of the event or an admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    // Update fields (organizer can update all except status)
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.ticketsAvailable = ticketsAvailable || event.ticketsAvailable;
    event.ticketPrice = ticketPrice || event.ticketPrice;

    // Only allow admins to update the status
    if (status && req.user.role === 'admin') {
      event.status = status;
    }

    // Save the updated event
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating event',
      error: error.message,
    });
  }
};


// Delete an event by ID
const deleteEvent = async (req, res) => {
  try {
    // Find and delete the event by ID
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};





module.exports = { createEvent, 
  getEventById , 
  getApprovedEvents, 
  getAllEvents,
  updateEvent, 
  deleteEvent
 };
