const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', authMiddleware, restrictTo('admin'), eventController.createEvent);

module.exports = router;
