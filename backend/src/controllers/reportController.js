const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { Parser } = require('json2csv');

/**
 * @desc    Export all bookings as a downloadable CSV report
 * @route   GET /api/reports/bookings/csv
 * @access  Private (Admin only)
 */
const exportBookingsCSV = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date venue ticketPrice')
      .sort({ createdAt: -1 });

    const flatData = bookings.map((b) => ({
      BookingReference: b.bookingReference,
      AttendeeName: b.attendeeName || b.user?.name || 'N/A',
      AttendeeEmail: b.attendeeEmail || b.user?.email || 'N/A',
      EventTitle: b.event?.title || 'Unknown Event',
      EventDate: b.event?.date ? new Date(b.event.date).toISOString().split('T')[0] : 'N/A',
      Venue: b.event?.venue || 'N/A',
      TicketsBooked: b.seatsBooked,
      UnitPrice: b.unitPrice || 0,
      TotalAmount: b.totalAmount || 0,
      Status: b.status,
      BookingDate: b.createdAt.toISOString(),
    }));

    const fields = [
      'BookingReference',
      'AttendeeName',
      'AttendeeEmail',
      'EventTitle',
      'EventDate',
      'Venue',
      'TicketsBooked',
      'UnitPrice',
      'TotalAmount',
      'Status',
      'BookingDate',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flatData);

    const filename = `bookings-report-${new Date().toISOString().slice(0, 10)}.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export events occupancy & registration summary as CSV
 * @route   GET /api/reports/events/csv
 * @access  Private (Admin only)
 */
const exportEventsCSV = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const flatData = events.map((e) => {
      const bookedSeats = e.capacity - e.availableSeats;
      const occupancyRate = ((bookedSeats / e.capacity) * 100).toFixed(1);

      return {
        EventId: e._id.toString(),
        Title: e.title,
        Category: e.category,
        Date: new Date(e.date).toISOString().split('T')[0],
        Time: e.time,
        Venue: e.venue,
        Location: e.location,
        TotalCapacity: e.capacity,
        AvailableSeats: e.availableSeats,
        BookedSeats: bookedSeats,
        OccupancyPercent: `${occupancyRate}%`,
        Status: e.status,
        TicketPrice: e.ticketPrice,
      };
    });

    const fields = [
      'EventId',
      'Title',
      'Category',
      'Date',
      'Time',
      'Venue',
      'Location',
      'TotalCapacity',
      'AvailableSeats',
      'BookedSeats',
      'OccupancyPercent',
      'Status',
      'TicketPrice',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flatData);

    const filename = `events-summary-${new Date().toISOString().slice(0, 10)}.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportBookingsCSV,
  exportEventsCSV,
};
