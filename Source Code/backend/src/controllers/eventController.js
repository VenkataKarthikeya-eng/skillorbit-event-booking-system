const Event = require('../models/Event');
const Booking = require('../models/Booking');

/**
 * @desc    Get all published events with filtering & search
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res, next) => {
  try {
    const { category, search, upcoming } = req.query;
    const filter = { status: 'published' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events including drafts/cancelled for Admin
 * @route   GET /api/events/admin/all
 * @access  Private (Admin only)
 */
const getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Admin only)
 */
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      location,
      bannerUrl,
      capacity,
      ticketPrice,
      status,
    } = req.body;

    if (!title || !description || !date || !time || !venue || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory event fields (title, description, date, time, venue, capacity)',
      });
    }

    const numCapacity = Number(capacity);
    if (isNaN(numCapacity) || numCapacity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be a positive number',
      });
    }

    const allowedStatuses = ['published', 'draft', 'cancelled'];
    const eventStatus = allowedStatuses.includes(status) ? status : 'published';

    const event = await Event.create({
      title,
      description,
      category: category || 'Workshop',
      date: new Date(date),
      time,
      venue,
      location: location || venue,
      bannerUrl: bannerUrl || undefined,
      capacity: numCapacity,
      availableSeats: numCapacity, // Initially all seats are available
      ticketPrice: Number(ticketPrice) || 0,
      organizer: req.user._id,
      status: eventStatus,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Admin only)
 */
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      location,
      bannerUrl,
      capacity,
      ticketPrice,
      status,
    } = req.body;

    if (capacity !== undefined) {
      const newCapacity = Number(capacity);
      if (newCapacity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Capacity must be greater than zero',
        });
      }

      // Calculate seats already booked
      const bookedSeats = event.capacity - event.availableSeats;
      if (newCapacity < bookedSeats) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce capacity below currently booked seats (${bookedSeats})`,
        });
      }

      event.capacity = newCapacity;
      event.availableSeats = newCapacity - bookedSeats;
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (location) event.location = location;
    if (bannerUrl) event.bannerUrl = bannerUrl;
    if (ticketPrice !== undefined) event.ticketPrice = Number(ticketPrice);
    if (status) event.status = status;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin only)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Cancel related bookings or alert if existing confirmed bookings
    const confirmedBookings = await Booking.countDocuments({
      event: event._id,
      status: 'confirmed',
    });

    if (confirmedBookings > 0) {
      // Mark as cancelled rather than deleting records to preserve audit trail
      event.status = 'cancelled';
      await event.save();

      return res.status(200).json({
        success: true,
        message: `Event has ${confirmedBookings} active booking(s). Status set to cancelled to protect historical data.`,
        event,
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
