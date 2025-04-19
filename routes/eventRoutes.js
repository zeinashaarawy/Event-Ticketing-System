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


router.post('/', protect, authorizeRoles('organizer', 'admin'), createEvent);

router.get('/all', protect, authorizeRoles('admin'), getAllEvents); 

//didn't work it requires a token but it shouldn't require and it's not read 
router.get('/', getApprovedEvents); 
  

router.get('/:id', getEventById);

router.put('/:id', protect, authorizeRoles('organizer', 'admin'), updateEvent);


router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;
