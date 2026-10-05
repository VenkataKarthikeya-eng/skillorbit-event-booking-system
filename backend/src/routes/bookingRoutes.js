const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getUserDashboard,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/user/dashboard', getUserDashboard);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
