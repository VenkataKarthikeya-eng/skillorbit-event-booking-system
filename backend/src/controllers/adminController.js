const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * @desc    Get Admin Dashboard Overview & Real Analytics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const upcomingEvents = await Event.countDocuments({
      status: 'published',
      date: { $gte: new Date() },
    });

    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });

    // Aggregate total tickets booked & total amount
    const bookingAggregates = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: '$seatsBooked' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalTicketsBooked = bookingAggregates[0]?.totalTickets || 0;
    const totalRevenue = bookingAggregates[0]?.totalRevenue || 0;

    // Category distribution for PieChart
    const categoryDistribution = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Monthly booking trend (last 6 months) for Bar/Area Chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: 'confirmed',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          bookings: { $sum: 1 },
          tickets: { $sum: '$seatsBooked' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const formattedTrends = bookingTrends.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      bookings: item.bookings,
      tickets: item.tickets,
    }));

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date venue')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalEvents,
          publishedEvents,
          upcomingEvents,
          totalUsers,
          totalBookings,
          totalTicketsBooked,
          totalRevenue,
        },
        categoryDistribution,
        bookingTrends: formattedTrends,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for administrative review
 * @route   GET /api/admin/bookings
 * @access  Private (Admin only)
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date venue ticketPrice')
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
 * @desc    Get all registered users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
};
