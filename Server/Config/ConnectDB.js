const mongoose = require('mongoose');

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ChatApp',
      // You can add other options here if necessary
    });
    console.log("Connected to DB");

    const connection = mongoose.connection;

    connection.on('error', (error) => {
      console.error("MongoDB connection error:", error);
    });

  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
}

module.exports = dbConnection;
