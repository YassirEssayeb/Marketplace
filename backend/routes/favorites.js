const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name as user_name, u.city as user_city, c.name as category_name
       FROM favorites f JOIN ads a ON f.ad_id = a.id
       JOIN users u ON a.user_id = u.id LEFT JOIN categories c ON a.category_id = c.id
       WHERE f.user_id = ? ORDER BY f.created_at DESC`, [req.user.id]
    );
    res.json(rows.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : [] })));
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/:adId', auth, async (req, res) => {
  try {
    await pool.query('INSERT IGNORE INTO favorites (user_id, ad_id) VALUES (?, ?)', [req.user.id, req.params.adId]);
    res.status(201).json({ message: 'Ajouté aux favoris' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/:adId', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM favorites WHERE user_id = ? AND ad_id = ?', [req.user.id, req.params.adId]);
    res.json({ message: 'Retiré des favoris' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/check/:adId', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM favorites WHERE user_id = ? AND ad_id = ?', [req.user.id, req.params.adId]);
    res.json({ favorited: rows.length > 0 });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

module.exports = router;
