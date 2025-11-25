const express = require('express');
const router = express.Router();

// Products filter
router.post('/filter', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const params = req.body;
    let query = 'SELECT * FROM products WHERE is_active = true';
    let queryParams = [];

    // Apply filters
    if (params.category) {
      query += ' AND category_id = ?';
      queryParams.push(params.category);
    }

    if (params.brand && params.brand.length > 0) {
      query += ' AND brand IN (?)';
      queryParams.push(params.brand);
    }

    if (params.price_min) {
      query += ' AND price >= ?';
      queryParams.push(params.price_min);
    }

    if (params.price_max) {
      query += ' AND price <= ?';
      queryParams.push(params.price_max);
    }

    if (params.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      queryParams.push(`%${params.search}%`, `%${params.search}%`);
    }

    // Sorting
    const sortOptions = {
      'price_asc': 'price ASC',
      'price_desc': 'price DESC',
      'name_asc': 'name ASC',
      'name_desc': 'name DESC',
      'newest': 'created_at DESC',
      'oldest': 'created_at ASC'
    };

    const sortBy = sortOptions[params.sort] || 'created_at DESC';
    query += ` ORDER BY ${sortBy}`;

    // Pagination
    const limit = Math.min(parseInt(params.limit) || 20, 100);
    const offset = parseInt(params.offset) || 0;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [products] = await db.execute(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = true';
    let countParams = [];
    if (params.category) {
      countQuery += ' AND category_id = ?';
      countParams.push(params.category);
    }
    if (params.brand && params.brand.length > 0) {
      countQuery += ' AND brand IN (?)';
      countParams.push(params.brand);
    }
    if (params.price_min) {
      countQuery += ' AND price >= ?';
      countParams.push(params.price_min);
    }
    if (params.price_max) {
      countQuery += ' AND price <= ?';
      countParams.push(params.price_max);
    }
    if (params.search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${params.search}%`, `%${params.search}%`);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to filter products' });
  }
});

module.exports = router;
