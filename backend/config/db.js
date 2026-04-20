const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  MongoDB not connected: ${error.message}`);
    console.warn('👉 Server will run without database. Set MONGO_URI in .env to enable DB features.');
    // Do NOT exit — let the server run so frontend & Socket.IO work
  }
};

module.exports = connectDB;
