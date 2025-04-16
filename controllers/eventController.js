const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, ticketsAvailable, ticketPrice } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      ticketsAvailable,
      ticketPrice,
      organizer: req.user.id  
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    console.log('🔍 Fetching all events...');
    const events = await Event.find();
    console.log('✅ Events found:', events.length);
    res.status(200).json(events);
  } catch (err) {
    console.error('❌ Get events error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Optional: Check if user is the organizer or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update fields
    const fieldsToUpdate = [
      'title', 'description', 'date', 'location',
      'ticketsAvailable', 'ticketPrice', 'status'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    const updated = await event.save();

    res.status(200).json({
      message: 'Event updated successfully',
      event: updated
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    console.log('🔍 Trying to delete event with ID:', req.params.id); // Debugging log

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only organizer or admin can delete
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (err) {
    console.error('Get my events error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getMyEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    const analytics = events.map(event => {
      const percentageBooked = event.ticketsAvailable === 0 ? 0
        : Math.round((event.ticketsBooked / event.ticketsAvailable) * 100);

      return {
        eventTitle: event.title,
        status: event.status
      };
    });

    res.status(200).json({
      message: 'Analytics fetched successfully',
      analytics
    });
  } catch (err) {
    console.error('Event analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getMyEventAnalytics
};
