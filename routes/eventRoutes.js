const express = require('express');
const router = express.Router();
const { createEvent, getEventById, getAllEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authentication');

// Organizer creates a new event
router.post('/events', protect, authorizeRoles('organizer'), createEvent);

// Public can view event by ID
router.get('/events', getAllEvents);

router.get('/events/:id', getEventById);
router.put('/events/:id', protect, authorizeRoles('organizer', 'admin'), updateEvent);
router.delete('/events/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;
