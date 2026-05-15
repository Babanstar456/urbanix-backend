// server.js
// ─────────────────────────────────────────────────────────────────────────────
//  URBANIX BACKEND — Main Entry Point
//  Stack: Node.js + Express + MongoDB Atlas + Mongoose
// ─────────────────────────────────────────────────────────────────────────────

// Load environment variables FIRST — before any other imports
require('dotenv').config();

const express       = require('express');
const path          = require('path');
const cors          = require('cors');
const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// ── Import Routes ────────────────────────────────────────
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const emailRoutes   = require('./routes/emailRoutes');

// ── Connect to MongoDB Atlas ─────────────────────────────
connectDB();

// ── Initialize Express App ───────────────────────────────
const app = express();

// ── CORS Configuration ───────────────────────────────────
// Allows your HTML frontend to call this backend API
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN,   // from .env file
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5500',     // VS Code Live Server default
      'http://127.0.0.1:3000',
    ];

    // Allow requests with no origin (Postman, mobile apps, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// ── Core Middleware ──────────────────────────────────────
app.use(express.json());              // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(requestLogger);               // Log all incoming requests

// ── Static File Serving ──────────────────────────────────
// Serves your frontend HTML, CSS, JS, and images from /public
// Place your index.html, style.css, and image/ folder inside /public
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ───────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/emails',   emailRoutes);

// ── Health Check Route ───────────────────────────────────
// Useful for Render deployment health checks
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Urbanix API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Catch-all: Serve Frontend for any unknown route ──────
// This makes single-page navigation work when hosted together
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Global Error Handler ─────────────────────────────────
// Must be LAST — catches all errors from routes
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log(`🚀 Urbanix Server running on port ${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log('─────────────────────────────────────────');
});