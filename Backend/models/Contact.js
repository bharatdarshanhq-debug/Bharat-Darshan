const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    index: true  // Add index for faster lookups
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  package: {
    type: String,
    default: 'General Inquiry'
  },
  destination: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved'],
    default: 'New',
    index: true  // Add index for filtering by status
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true  // Add index for sorting by date
  }
});

module.exports = mongoose.model('Contact', contactSchema);

