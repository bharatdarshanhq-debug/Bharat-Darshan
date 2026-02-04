const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for sorting by order
faqSchema.index({ order: 1 });

module.exports = mongoose.model('Faq', faqSchema);
