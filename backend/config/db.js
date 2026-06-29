// ============================================================
// WEATHERVERSE — Database Configuration
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Increase timeout and add retry logic
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increased from 10000 to 30000
      socketTimeoutMS: 60000, // Increased from 45000 to 60000
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MONGO_URI in .env file');
    console.log('3. Check if MongoDB Atlas IP whitelist includes your IP');
    console.log('4. Try using a VPN if in a restricted region');
    console.log('5. Check if MongoDB Atlas cluster is active');
    
    // Don't exit process, keep trying to reconnect
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
    
    return null;
  }
};

module.exports = connectDB;