const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?', [req.user.id]
    );
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id, parseInt(limit), offset]
    );
    res.json({
      notifications: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getRecent = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Notification marquée comme lue' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Notification introuvable' });
    res.json({ message: 'Notification supprimée' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Toutes les notifications supprimées' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    let [rows] = await pool.query(
      'SELECT * FROM notification_preferences WHERE user_id = ?', [req.user.id]
    );
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO notification_preferences (user_id) VALUES (?)', [req.user.id]
      );
      [rows] = await pool.query(
        'SELECT * FROM notification_preferences WHERE user_id = ?', [req.user.id]
      );
    }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { email_messages, email_favorites, email_promos, push_messages, push_favorites, push_promos } = req.body;
    await pool.query(
      `INSERT INTO notification_preferences (user_id, email_messages, email_favorites, email_promos, push_messages, push_favorites, push_promos)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email_messages = VALUES(email_messages),
         email_favorites = VALUES(email_favorites),
         email_promos = VALUES(email_promos),
         push_messages = VALUES(push_messages),
         push_favorites = VALUES(push_favorites),
         push_promos = VALUES(push_promos)`,
      [req.user.id,
        email_messages ? 1 : 0, email_favorites ? 1 : 0, email_promos ? 1 : 0,
        push_messages ? 1 : 0, push_favorites ? 1 : 0, push_promos ? 1 : 0
      ]
    );
    const [rows] = await pool.query(
      'SELECT * FROM notification_preferences WHERE user_id = ?', [req.user.id]
    );
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createNotification = async (userId, type, title, message, link) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
      [userId, type, title, message, link || null]
    );
  } catch {
    // silently fail - notification creation should not break main flow
  }
};
