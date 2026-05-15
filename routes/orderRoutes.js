// routes/orderRoutes.js
// Handles order creation from the Buy Now checkout form

const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// ─────────────────────────────────────────────────────────
//  POST /api/orders
//  Creates a new order from the checkout form
//
//  Body (JSON):
//  {
//    "customerName": "Arjun Sharma",
//    "phone": "9876543210",
//    "address": {
//      "street": "42 Park Street",
//      "city": "Kolkata",
//      "state": "West Bengal",
//      "pin": "700016"
//    },
//    "productName": "Bleach Tee – Vol.1",
//    "size": "M",
//    "quantity": 1,
//    "total": 599,
//    "paymentMethod": "Razorpay"
//  }
// ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const {
      customerName,
      phone,
      address,
      productName,
      size,
      quantity,
      total,
      paymentMethod,
      razorpayPaymentId,
    } = req.body;

    // Basic presence check before Mongoose validation
    if (!customerName || !phone || !address || !productName || !size) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerName, phone, address, productName, size',
      });
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      productName,
      size,
      quantity: quantity || 1,
      total: total || 599,
      paymentMethod: paymentMethod || 'Razorpay',
      razorpayPaymentId: razorpayPaymentId || null,
    });

    console.log(`📦 New Order: ${order._id} | ${productName} | ₹${total}`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/orders
//  Returns all orders — use for admin dashboard
//  (In production: protect this route with admin authentication)
// ─────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/orders/:id
//  Returns a single order by its MongoDB _id
// ─────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;