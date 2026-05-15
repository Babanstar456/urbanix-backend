// models/Order.js
// Stores customer order data submitted via the Buy Now checkout form

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Customer's full name
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },

    // 10-digit Indian mobile number
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },

    // Full delivery address object
    address: {
      street: { type: String, required: true, trim: true },
      city:   { type: String, required: true, trim: true },
      state:  { type: String, required: true, trim: true },
      pin:    { type: String, required: true, match: [/^\d{6}$/, 'PIN must be 6 digits'] },
    },

    // Product details at time of order
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    // Size selected by customer
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
    },

    // Number of items ordered (always 1 for Buy Now flow)
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    // Final total amount paid (includes tax + delivery)
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment method used
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'NetBanking', 'COD', 'Razorpay'],
      default: 'Razorpay',
    },

    // Order status for admin tracking
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    // Optional: Razorpay payment ID for reference
    razorpayPaymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Order', orderSchema);