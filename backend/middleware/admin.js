const pool = require('../config/db');

const admin = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0 || !users[0].is_admin) {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = admin;
