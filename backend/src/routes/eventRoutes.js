const express = require('express');
const router = express.Router();
const {
  getEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), createEvent);

router.get('/admin/all', protect, authorize('admin'), getAllEventsAdmin);

router.route('/:id')
  .get(getEventById)
  .put(protect, authorize('admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

module.exports = router;
