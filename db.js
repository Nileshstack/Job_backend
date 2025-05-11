const mongoose = require('mongoose');

// Use environment variable, fallback to local MongoDB if not set
const mongooseURL = process.env.MONGODB_URL_GLOBAL ;

// Connect to MongoDB
mongoose.connect(mongooseURL)
    .then(() => console.log(' Connected to MongoDB'))
    .catch((error) => console.error(' Error in connection:', error));

// Get the database connection instance
const db = mongoose.connection;

// Handle connection errors
db.on('error', (error) => {
    console.error(' MongoDB connection error:', error);
});

module.exports = db;