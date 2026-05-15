// routes/emailRoutes.js
// Handles email subscriptions from the "Get Notified" section

const express         = require('express');
const router          = express.Router();
const EmailSubscriber = require('../models/EmailSubscriber');

// ─────────────────────────────────────────────────────────
//  POST /api/emails
//  Subscribes a user's email for new drop notifications
//
//  Body (JSON):
//  { "email": "fan@example.com" }
// ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    // Check if email already subscribed — return friendly message instead of error
    const existing = await EmailSubscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You're already on the list! We'll notify you first.",
        alreadySubscribed: true,
      });
    }

    const subscriber = await EmailSubscriber.create({ email });

    console.log(`📧 New Subscriber: ${subscriber.email}`);

    res.status(201).json({
      success: true,
      message: "You're in! We'll notify you when new drops go live.",
      data: { email: subscriber.email, subscribedAt: subscriber.createdAt },
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/emails
//  Returns all subscribers — use for admin/marketing
//  (In production: protect this route with admin authentication)
// ─────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const subscribers = await EmailSubscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;