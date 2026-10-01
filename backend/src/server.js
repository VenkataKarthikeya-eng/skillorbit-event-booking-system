require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB().then((connected) => {
  if (connected) {
    console.log('📦 Database initialized and ready.');
  } else {
    console.log('⚠️  Server running in standalone mode (configure MONGODB_URI to enable full database persistence).');
  }
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Event Booking System Backend Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
