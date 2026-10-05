const express = require('express');
const router = express.Router();
const {
  exportBookingsCSV,
  exportEventsCSV,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Restrict all reports to authenticated admin
router.use(protect, authorize('admin'));

router.get('/bookings/csv', exportBookingsCSV);
router.get('/events/csv', exportEventsCSV);

module.exports = router;
