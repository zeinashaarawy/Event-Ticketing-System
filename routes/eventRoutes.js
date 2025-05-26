const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEventById, 
  getApprovedEvents, 
  getAllEvents,
  updateEvent, 
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authentication');

// Get events created by the current user
router.get('/my-events', protect, authorizeRoles('organizer', 'admin'), getMyEvents);

router.get('/', getApprovedEvents);
router.get('/all', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorizeRoles('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;
