const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const pool = require('../config/db');

router.use(auth, admin);

router.get('/stats', async (req, res) => {
  try {
    const [[{ users }]] = await pool.query('SELECT COUNT(*) as users FROM users');
    const [[{ ads }]] = await pool.query('SELECT COUNT(*) as ads FROM ads');
    const [[{ active }]] = await pool.query("SELECT COUNT(*) as active FROM ads WHERE status = 'active'");
    const [[{ reports }]] = await pool.query('SELECT COUNT(*) as reports FROM reports');
    const [[{ messages }]] = await pool.query('SELECT COUNT(*) as messages FROM messages');
    res.json({ users, ads, active, reports, messages });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, city, is_admin, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { is_admin } = req.body;
    await pool.query('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin ? 1 : 0, req.params.id]);
    res.json({ message: 'Utilisateur mis à jour' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/ads', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name as user_name, c.name as category_name
       FROM ads a JOIN users u ON a.user_id = u.id LEFT JOIN categories c ON a.category_id = c.id
       ORDER BY a.created_at DESC`
    );
    res.json(rows.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : [] })));
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.put('/ads/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE ads SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Annonce mise à jour' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/ads/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Annonce supprimée' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/reports', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, a.title as ad_title, u.name as reporter_name
       FROM reports r JOIN ads a ON r.ad_id = a.id JOIN users u ON r.reporter_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/reports/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reports WHERE id = ?', [req.params.id]);
    res.json({ message: 'Signalement supprimé' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom requis' });
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
    res.json({ message: 'Catégorie mise à jour' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Catégorie supprimée' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

module.exports = router;
