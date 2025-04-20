const express = require('express');
const router = express.Router();



const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getOrganizerEvents,
  getEventAnalytics, 
  getUserBookings
} = require('../controllers/userController');

const { protect, authorizeRoles } = require('../middleware/authentication');
const Event = require('../models/Event');

// Authenticated user routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/bookings', protect, authorizeRoles('user') , getUserBookings);


router.get('/events', protect, authorizeRoles('organizer'), getOrganizerEvents);
router.get('/events/analytics' , protect , authorizeRoles('organizer') , getEventAnalytics);



// Admin-only routes
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);
router.put('/:id', protect, authorizeRoles('admin'), updateUserRole);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
