const Booking = require('../models/Booking');
const Event = require('../models/Event');
const generateBookingReference = require('../utils/generateReference');

/**
 * @desc    Create a new booking (concurrency-safe atomic seat decrement & anti-double-booking)
 * @route   POST /api/bookings
 * @access  Private (Authenticated User)
 */
const createBooking = async (req, res, next) => {
  try {
    const { eventId, seatsBooked, attendeeName, attendeeEmail } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const seats = Number(seatsBooked);
    if (!seats || seats < 1 || !Number.isInteger(seats)) {
      return res.status(400).json({
        success: false,
        message: 'Number of tickets must be a positive whole number (minimum 1)',
      });
    }

    if (seats > 10) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book more than 10 seats in a single reservation',
      });
    }

    // 1. Verify event existence, status, and date
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'The requested event could not be found',
      });
    }

    if (existingEvent.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'This event is currently not open for bookings',
      });
    }

    if (new Date(existingEvent.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for past events',
      });
    }

    // 2. Prevent excessive double booking by same attendee (max 10 seats per user per event)
    const existingUserBookings = await Booking.find({
      user: req.user._id,
      event: eventId,
      status: 'confirmed',
    });

    const alreadyBookedSeats = existingUserBookings.reduce(
      (sum, b) => sum + b.seatsBooked,
      0
    );

    if (alreadyBookedSeats + seats > 10) {
      return res.status(400).json({
        success: false,
        message: `Maximum ticket limit reached. You already have ${alreadyBookedSeats} confirmed ticket(s) for this event. Maximum per attendee is 10.`,
      });
    }

    // 3. Concurrency-Safe Atomic Decrement:
    // Only succeeds if availableSeats is >= requested seats AT THIS EXACT MOMENT
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: 'published',
        availableSeats: { $gte: seats },
      },
      {
        $inc: { availableSeats: -seats },
      },
      {
        new: true,
      }
    );

    if (!event) {
      // Re-fetch to give exact remaining count
      const refreshedEvent = await Event.findById(eventId);
      return res.status(400).json({
        success: false,
        message: `Insufficient seats available. Only ${refreshedEvent ? refreshedEvent.availableSeats : 0} seat(s) remaining.`,
      });
    }

    const unitPrice = event.ticketPrice || 0;
    const totalAmount = unitPrice * seats;
    const bookingReference = generateBookingReference();

    const booking = await Booking.create({
      bookingReference,
      user: req.user._id,
      event: event._id,
      seatsBooked: seats,
      unitPrice,
      totalAmount,
      status: 'confirmed',
      attendeeName: attendeeName || req.user.name,
      attendeeEmail: attendeeEmail || req.user.email,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date time venue location bannerUrl ticketPrice')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's booking history
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date time venue location bannerUrl status ticketPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get booking details by ID or Reference
 * @route   GET /api/bookings/:id
 * @access  Private (Owner or Admin)
 */
const getBookingById = async (req, res, next) => {
  try {
    const query = req.params.id.startsWith('EVT-')
      ? { bookingReference: req.params.id }
      : { _id: req.params.id };

    const booking = await Booking.findOne(query)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only owner or admin can view booking
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking and release reserved seats
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private (Owner or Admin)
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled',
      });
    }

    // Mark as cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Safely increment available seats back on the event
    await Event.findByIdAndUpdate(booking.event, {
      $inc: { availableSeats: booking.seatsBooked },
    });

    const updatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date time venue location bannerUrl status ticketPrice')
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and reserved seats released back to event',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user dashboard summary, upcoming passes & discover events
 * @route   GET /api/bookings/user/dashboard
 * @access  Private
 */
const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allBookings = await Booking.find({ user: userId })
      .populate('event', 'title date time venue location bannerUrl status ticketPrice')
      .sort({ createdAt: -1 });

    const totalBookings = allBookings.length;
    const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed');
    const activePasses = confirmedBookings.length;
    const cancelledCount = totalBookings - activePasses;
    const totalTickets = confirmedBookings.reduce((sum, b) => sum + b.seatsBooked, 0);

    // Upcoming bookings where event date is in future
    const upcomingBookings = confirmedBookings.filter(
      (b) => b.event && new Date(b.event.date) >= new Date()
    );

    // Recent 4 bookings
    const recentBookings = allBookings.slice(0, 4);

    // Booked event IDs
    const bookedEventIds = allBookings.map((b) => b.event?._id).filter(Boolean);

    // 3 upcoming published events for discovery
    const discoverEvents = await Event.find({
      status: 'published',
      date: { $gte: new Date() },
      _id: { $nin: bookedEventIds },
    })
      .sort({ date: 1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBookings,
          activePasses,
          cancelledCount,
          totalTickets,
        },
        upcomingBookings,
        recentBookings,
        discoverEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getUserDashboard,
};
