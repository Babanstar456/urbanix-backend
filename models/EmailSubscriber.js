// models/EmailSubscriber.js
// Stores emails from the "Get Notified" section on the homepage

const mongoose = require('mongoose');

const emailSubscriberSchema = new mongoose.Schema(
  {
    // Subscriber's email address — must be unique
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,                         // prevent duplicate signups
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    // Where did the signup come from? (for analytics)
    source: {
      type: String,
      default: 'homepage-notify',
    },
  },
  {
    timestamps: true, // createdAt = signup date
  }
);

module.exports = mongoose.model('EmailSubscriber', emailSubscriberSchema);