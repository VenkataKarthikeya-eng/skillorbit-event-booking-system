const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be linked to a registered user'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Booking must reference a valid event'],
    },
    seatsBooked: {
      type: Number,
      required: [true, 'Must specify number of seats/tickets'],
      min: [1, 'Must book at least 1 seat'],
      max: [10, 'Cannot book more than 10 seats in a single reservation'],
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    attendeeName: {
      type: String,
      trim: true,
    },
    attendeeEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup by user and event
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
