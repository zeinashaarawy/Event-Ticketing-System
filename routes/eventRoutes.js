const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEventById, 
  getApprovedEvents, 
  getAllEvents,
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authentication');

router.get('/', getApprovedEvents);
router.get('/all', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorizeRoles('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;
