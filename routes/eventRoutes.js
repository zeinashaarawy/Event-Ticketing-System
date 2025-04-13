const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware, restrictTo } = require('../middleware/authentication');
const { protect } = require('../middleware/authentication');  // Import auth middleware
const { authorize } = require('../middleware/authorization');  // Import role-based auth middleware
const { createEvent, getEventById } = require('../controllers/eventController'); // Import event controller

router.post('/events', protect, authorize('organizer', 'admin'), createEvent);
router.get('/events/:id', getEventById);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', authentication, restrictTo('admin'), eventController.createEvent);

module.exports = router;
