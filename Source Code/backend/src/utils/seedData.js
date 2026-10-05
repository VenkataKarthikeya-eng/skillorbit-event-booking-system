require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const generateBookingReference = require('./generateReference');

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ Cannot run seed script: MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas for seeding.');

    const force = process.argv.includes('--force');

    if (force) {
      console.log('🧹 Clearing existing collections (--force detected)...');
      await Booking.deleteMany({});
      await Event.deleteMany({});
      await User.deleteMany({});
    }

    // 1. Create or ensure Admin & Demo User exist
    let admin = await User.findOne({ email: 'admin@skillorbit.com' });
    if (!admin) {
      admin = await User.create({
        name: 'SkillOrbit Administrator',
        email: 'admin@skillorbit.com',
        password: 'AdminPassword123!', // Will be hashed by pre-save hook
        role: 'admin',
        phone: '+91 9876543210',
      });
      console.log('👤 Admin user created: admin@skillorbit.com / AdminPassword123!');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    let demoUser = await User.findOne({ email: 'student@skillorbit.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'student@skillorbit.com',
        password: 'StudentPassword123!',
        role: 'user',
        phone: '+91 9876543211',
      });
      console.log('👤 Demo student user created: student@skillorbit.com / StudentPassword123!');
    } else {
      console.log('ℹ️  Demo student user already exists.');
    }

    // 2. Check if events exist
    const eventCount = await Event.countDocuments();
    if (eventCount === 0 || force) {
      console.log('🌱 Seeding initial events...');

      const sampleEvents = [
        {
          title: 'Global AI & Cloud Innovation Summit 2026',
          description:
            'Join international industry leaders and tech innovators exploring state-of-the-art Generative AI, multi-cloud architectures, and sustainable computing. Keynote speeches, panel discussions, and interactive breakout sessions.',
          category: 'Conference',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          time: '09:30 AM - 05:00 PM',
          venue: 'Convention Centre, Tech Park',
          location: 'Bengaluru, Karnataka',
          bannerUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
          capacity: 250,
          availableSeats: 242,
          ticketPrice: 499,
          organizer: admin._id,
          status: 'published',
        },
        {
          title: 'Full-Stack Modern Web Engineering Masterclass',
          description:
            'A hands-on intensive workshop mastering modern web development: React 19, Node.js, Express, state management, REST APIs, and production deployment workflows.',
          category: 'Workshop',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          time: '10:00 AM - 04:00 PM',
          venue: 'Innovation Hub Hall 3',
          location: 'Hyderabad, Telangana',
          bannerUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
          capacity: 80,
          availableSeats: 74,
          ticketPrice: 299,
          organizer: admin._id,
          status: 'published',
        },
        {
          title: 'SkillOrbit Annual College Cultural Fest - Revelations',
          description:
            'The flagship inter-college festival featuring music bands, dance competitions, dramatic arts, quiz championships, and celebrity musical guest performances.',
          category: 'College Fest',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
          time: '05:00 PM - 10:30 PM',
          venue: 'Campus Open Air Amphitheatre',
          location: 'Bengaluru, Karnataka',
          bannerUrl:
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80',
          capacity: 500,
          availableSeats: 485,
          ticketPrice: 199,
          organizer: admin._id,
          status: 'published',
        },
        {
          title: 'Next-Gen Cybersecurity & Cloud Defense Webinar',
          description:
            'Learn critical defensive strategies against zero-day vulnerabilities, API security vulnerabilities, automated bot networks, and cloud misconfigurations.',
          category: 'Webinar',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          time: '06:00 PM - 08:00 PM',
          venue: 'Online Zoom Stream (Link upon booking)',
          location: 'Online',
          bannerUrl:
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
          capacity: 300,
          availableSeats: 290,
          ticketPrice: 0,
          organizer: admin._id,
          status: 'published',
        },
        {
          title: 'Indie Rock & Acoustic Live Session',
          description:
            'An intimate evening of live indie rock and soulful acoustic melodies featuring premier underground bands and singer-songwriters in a cozy setting.',
          category: 'Concert',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          time: '07:30 PM - 11:00 PM',
          venue: 'The Soundstage Club',
          location: 'Mumbai, Maharashtra',
          bannerUrl:
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
          capacity: 150,
          availableSeats: 146,
          ticketPrice: 350,
          organizer: admin._id,
          status: 'published',
        },
      ];

      const createdEvents = await Event.insertMany(sampleEvents);
      console.log(`🎉 Inserted ${createdEvents.length} realistic sample events.`);

      // 3. Create initial demo bookings to populate charts and tables
      console.log('🎟️ Seeding sample demo bookings for analytics...');
      const sampleBookings = [
        {
          bookingReference: generateBookingReference(),
          user: demoUser._id,
          event: createdEvents[0]._id,
          seatsBooked: 2,
          unitPrice: createdEvents[0].ticketPrice,
          totalAmount: createdEvents[0].ticketPrice * 2,
          status: 'confirmed',
          attendeeName: demoUser.name,
          attendeeEmail: demoUser.email,
        },
        {
          bookingReference: generateBookingReference(),
          user: demoUser._id,
          event: createdEvents[1]._id,
          seatsBooked: 1,
          unitPrice: createdEvents[1].ticketPrice,
          totalAmount: createdEvents[1].ticketPrice,
          status: 'confirmed',
          attendeeName: demoUser.name,
          attendeeEmail: demoUser.email,
        },
      ];

      await Booking.insertMany(sampleBookings);
      console.log('✅ Initial demo bookings seeded successfully.');
    } else {
      console.log(`ℹ️  Events already present (${eventCount} records). Skipping event seed.`);
    }

    console.log('\n=========================================');
    console.log('🚀 Seed process completed successfully!');
    console.log('Credentials:');
    console.log('Admin:   admin@skillorbit.com   / AdminPassword123!');
    console.log('Student: student@skillorbit.com / StudentPassword123!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
