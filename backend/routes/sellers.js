const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.avatar_url, u.city, u.headline, u.created_at,
        COUNT(a.id) as ad_count,
        ROUND(AVG(r.rating), 1) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM users u
      LEFT JOIN ads a ON a.user_id = u.id AND a.status = 'active'
      LEFT JOIN (
        SELECT ad_id, rating FROM favorites
      ) r ON 1=0
      GROUP BY u.id
      ORDER BY ad_count DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Sellers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
