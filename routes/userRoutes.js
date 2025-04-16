const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  login,
  registerUser,
  forgetPassword
} = require('../controllers/userController');

const { protect, authorizeRoles } = require('../middleware/authentication');

// Public routes
router.post('/register', registerUser);
router.post('/login', login);
router.put('/forgetPassword', forgetPassword);

// Authenticated user routes
router.get('/users/profile', protect, getProfile);
router.put('/users/profile', protect, updateProfile);

// Admin-only routes
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.get('/users/:id', protect, authorizeRoles('admin'), getUserById);
router.put('/users/:id', protect, authorizeRoles('admin'), updateUserRole);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);
const {
  getMyEvents,
  getMyEventAnalytics
} = require('../controllers/eventController');

// Organizer-only
router.get('/users/events', protect, authorizeRoles('organizer'), getMyEvents);
router.get('/users/events/analytics', protect, authorizeRoles('organizer'), getMyEventAnalytics);

module.exports = router;
