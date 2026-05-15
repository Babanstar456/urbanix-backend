// models/Product.js
// Defines the schema for Urbanix products stored in MongoDB
// NOTE: Images are NOT stored in DB — only the file path string is stored

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Product display name — e.g. "Bleach Tee – Vol.1"
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    // Category slug — "anime" | "valorant" | "marvel" | "others"
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['anime', 'valorant', 'marvel', 'others'],
      lowercase: true,
    },

    // Display label for category — "Anime" | "Valorant" | "Marvel" | "Others"
    catLabel: {
      type: String,
      required: true,
      trim: true,
    },

    // Price in Indian Rupees
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 499,
    },

    // Image path(s) — can be a single string or array of strings
    // Examples:
    //   "image/anime/bleach/anime1.png"
    //   ["image/anime/naruto/n7-front.png", "image/anime/naruto/n7-back.png"]
    image: {
      type: mongoose.Schema.Types.Mixed, // accepts String or Array
      required: [true, 'Image path is required'],
    },

    // Available sizes for this product
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },

    // Optional badge label — "new" | "hot" | null
    badge: {
      type: String,
      enum: ['new', 'hot', null],
      default: null,
    },

    // Short description shown on product page
    description: {
      type: String,
      default: 'Premium oversized streetwear tee. 100% cotton, vibrant print.',
      trim: true,
    },

    // Stock count (0 = out of stock)
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Index for fast category filtering
productSchema.index({ category: 1 });

// Index for name search
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);