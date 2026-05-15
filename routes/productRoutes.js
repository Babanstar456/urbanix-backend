// routes/productRoutes.js
// All API routes related to products

const express  = require('express');
const router   = express.Router();
const Product  = require('../models/Product');

// ─────────────────────────────────────────────────────────
//  GET /api/products
//  Returns all products, with optional category filter & search
//
//  Query params:
//    ?category=anime          → filter by category
//    ?search=bleach           → text search by name
//    ?sort=price-asc          → sort options
//    ?page=1&limit=20         → pagination
//
//  Example: GET /api/products?category=valorant&page=1&limit=20
// ─────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 50 } = req.query;

    // Build the MongoDB query object
    const query = {};

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    if (search) {
      // Case-insensitive partial match on product name
      query.name = { $regex: search, $options: 'i' };
    }

    // Build the sort object
    let sortOption = {};
    switch (sort) {
      case 'price-asc':  sortOption = { price:  1 }; break;
      case 'price-desc': sortOption = { price: -1 }; break;
      case 'name-asc':   sortOption = { name:   1 }; break;
      default:           sortOption = { createdAt: -1 }; // newest first
    }

    // Pagination
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error); // passes to errorHandler middleware
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/products/:id
//  Returns a single product by its MongoDB _id
//
//  Example: GET /api/products/664a1b2c3d4e5f6a7b8c9d0e
// ─────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────
//  POST /api/products
//  Creates a new product (admin use — protect with auth in future)
//
//  Body (JSON):
//  {
//    "name": "Bleach Tee – Vol.1",
//    "category": "anime",
//    "catLabel": "Anime",
//    "price": 499,
//    "image": "image/anime/bleach/anime1.png",
//    "badge": "new"
//  }
// ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────
//  POST /api/products/seed
//  Seeds the database with all 50 products from the frontend
//  Run once to populate MongoDB — then comment out for safety
// ─────────────────────────────────────────────────────────
router.post('/seed', async (req, res, next) => {
  try {
    const products = [
      // BLEACH
      { name: "Bleach Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime1.png", badge: "new" },
      { name: "Bleach Tee – Vol.2", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime2.png" },
      { name: "Bleach Tee – Vol.3", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime3.png" },
      { name: "Bleach Tee – Vol.4", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime4.png", badge: "hot" },
      { name: "Bleach Tee – Vol.5", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime5.png" },
      { name: "Bleach Tee – Vol.6", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime6.png" },
      { name: "Bleach Tee – Vol.7", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/bleach/anime7.png" },
      // NARUTO
      { name: "Naruto Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/naruto/n1.png", badge: "new" },
      { name: "Naruto Tee – Vol.2", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/naruto/n2.png" },
      { name: "Naruto Tee – Vol.3", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/naruto/n3.png" },
      { name: "Naruto Tee – Vol.4", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/naruto/n4.png" },
      { name: "Naruto Tee – Vol.5", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/naruto/n5.png", badge: "hot" },
      { name: "Naruto Tee – Vol.6", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/naruto/n6.png" },
      { name: "Naruto Tee – Vol.7", category: "anime", catLabel: "Anime", price: 499, image: ["image/anime/naruto/n7-front.png", "image/anime/naruto/n7-back.png"] },
      // ONE PIECE
      { name: "One Piece Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/one-piece/op1.png", badge: "new" },
      { name: "One Piece Tee – Vol.2", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/one-piece/op2.png" },
      // DEMON SLAYER
      { name: "Demon Slayer Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/demon-slayer/ds1.png", badge: "new" },
      { name: "Demon Slayer Tee – Vol.2", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/demon-slayer/ds2.png" },
      { name: "Demon Slayer Tee – Vol.3", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/demon-slayer/ds3.png" },
      // JUJUTSU KAISEN
      { name: "Jujutsu Kaisen Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/jujutsu-kaisen/js1.png", badge: "new" },
      { name: "Jujutsu Kaisen Tee – Vol.2", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/jujutsu-kaisen/js2.png" },
      // SOLO LEVELLING
      { name: "Solo Levelling Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/solo-levelling/sl1.png", badge: "new" },
      // POKEMON
      { name: "Pokémon Tee – Vol.1", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/pokemon/poke1.png", badge: "new" },
      { name: "Pokémon Tee – Vol.2", category: "anime", catLabel: "Anime", price: 499, image: "image/anime/pokemon/poke2.png" },
      // MARVEL
      { name: "Spider-Man Tee – Vol.1", category: "marvel", catLabel: "Marvel", price: 499, image: "image/marvel/spider-man-1.png", badge: "new" },
      { name: "Spider-Man Tee – Vol.2", category: "marvel", catLabel: "Marvel", price: 499, image: "image/marvel/spider-man-2.png" },
      { name: "Spider-Man Tee – Vol.3", category: "marvel", catLabel: "Marvel", price: 499, image: "image/marvel/spider-man-3.png" },
      // VALORANT AGENTS
      { name: "Valorant Tee – Vol.1",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va1.png",  badge: "new" },
      { name: "Valorant Tee – Vol.2",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va2.png" },
      { name: "Valorant Tee – Vol.3",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va3.png" },
      { name: "Valorant Tee – Vol.4",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va4.png" },
      { name: "Valorant Tee – Vol.5",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va5.png" },
      { name: "Valorant Tee – Vol.6",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va6.1.png" },
      { name: "Valorant Tee – Vol.7",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va7.png" },
      { name: "Valorant Tee – Vol.8",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va8.png" },
      { name: "Valorant Tee – Vol.9",  category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va9.png" },
      { name: "Valorant Tee – Vol.10", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va10.png" },
      { name: "Valorant Tee – Vol.11", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va11.png" },
      { name: "Valorant Tee – Vol.12", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va12.png" },
      { name: "Valorant Tee – Vol.13", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va13.png" },
      { name: "Valorant Tee – Vol.14", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va14.png" },
      { name: "Valorant Tee – Vol.15", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va15.png" },
      { name: "Valorant Tee – Vol.16", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va16.png" },
      { name: "Valorant Tee – Vol.17", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va17.png" },
      { name: "Valorant Tee – Vol.18", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va18.png" },
      { name: "Valorant Tee – Vol.19", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va19.png" },
      { name: "Valorant Tee – Vol.20", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-agents/va20.png" },
      // VALORANT GUNS
      { name: "Valorant Tee – Vol.21", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-guns/vg1.png" },
      { name: "Valorant Tee – Vol.22", category: "valorant", catLabel: "Valorant", price: 499, image: "image/valorant/valorant-guns/vg2.png" },
    ];

    // Clear existing products first to avoid duplicates
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: `✅ Database seeded with ${inserted.length} products`,
      count: inserted.length,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;