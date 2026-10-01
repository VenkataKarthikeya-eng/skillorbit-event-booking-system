const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Event title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select an event category'],
      enum: {
        values: [
          'Conference',
          'Workshop',
          'Concert',
          'College Fest',
          'Webinar',
          'Networking',
          'Tech Talk',
          'Cultural',
          'Sports',
          'Other',
        ],
        message: '{VALUE} is not a supported event category',
      },
      default: 'Workshop',
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event timing (e.g. 10:00 AM)'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue name or platform'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide city/state or Online'],
      trim: true,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    capacity: {
      type: Number,
      required: [true, 'Please set total seating capacity'],
      min: [1, 'Capacity must be at least 1 seat'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats count is required'],
      min: [0, 'Available seats cannot be negative'],
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: [0, 'Ticket price cannot be negative'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event must have an assigned organizer or admin'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searching and filtering
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ title: 'text', description: 'text', venue: 'text' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
