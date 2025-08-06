const mongoose = require('mongoose');
const config = require('./config.json');

console.log('Connection string:', config.connectionString);

mongoose.connect(config.connectionString)
  .then(() => {
    console.log('MongoDB connected successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });