const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, Node c-ares DNS resolver can fail on SRV queries with ECONNREFUSED
// Setting reliable DNS servers ensures seamless MongoDB Atlas connection
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if not supported in environment
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: MONGODB_URI is not set in environment variables.');
    console.warn('\x1b[33m%s\x1b[0m', '   Please configure your MongoDB Atlas connection string in backend/.env');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('\x1b[32m%s\x1b[0m', `✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
