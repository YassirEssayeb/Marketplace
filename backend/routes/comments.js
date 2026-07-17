const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');
const { createNotification } = require('../controllers/notificationController');

router.get('/ad/:adId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar_url
       FROM comments c JOIN users u ON c.user_id = u.id
       WHERE c.ad_id = ? ORDER BY c.created_at DESC`, [req.params.adId]
    );
    const map = {};
    const roots = [];
    rows.forEach(r => { r.replies = []; map[r.id] = r; });
    rows.forEach(r => {
      if (r.parent_id && map[r.parent_id]) {
        map[r.parent_id].replies.push(r);
      } else {
        roots.push(r);
      }
    });
    res.json(roots);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/ad/:adId', auth, async (req, res) => {
  try {
    const { content, parent_id } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Contenu requis' });
    const [result] = await pool.query(
      'INSERT INTO comments (ad_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
      [req.params.adId, req.user.id, parent_id || null, content.trim()]
    );
    const [[comment]] = await pool.query(
      `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar_url
       FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?`, [result.insertId]
    );
    comment.replies = [];

    const [[ad]] = await pool.query('SELECT user_id, title FROM ads WHERE id = ?', [req.params.adId]);
    if (ad && ad.user_id !== req.user.id) {
      const [[user]] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
      const userName = user ? user.name : 'Un utilisateur';
      await createNotification(
        ad.user_id, 'comment',
        'Nouveau commentaire',
        `${userName} a commenté "${ad.title}"`,
        '/ads/' + req.params.adId
      );
    }

    res.status(201).json(comment);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/:commentId', auth, async (req, res) => {
  try {
    const [[comment]] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [req.params.commentId]);
    if (!comment) return res.status(404).json({ error: 'Non trouvé' });
    if (comment.user_id !== req.user.id) return res.status(403).json({ error: 'Accès interdit' });
    await pool.query('DELETE FROM comments WHERE id = ?', [req.params.commentId]);
    res.json({ message: 'Supprimé' });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

module.exports = router;
