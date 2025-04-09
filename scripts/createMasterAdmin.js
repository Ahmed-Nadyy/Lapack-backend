require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createMasterAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if master admin already exists
    const masterExists = await User.findOne({ role: 'master' });
    if (masterExists) {
      console.log('Master admin already exists');
      process.exit(0);
    }

    // Create master admin
    await User.create({
      email: process.env.MASTER_EMAIL,
      password: process.env.MASTER_PASSWORD,
      role: 'master'
    });

    console.log('Master admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating master admin:', error);
    process.exit(1);
  }
};

createMasterAdmin();