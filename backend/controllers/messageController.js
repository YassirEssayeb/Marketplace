const pool = require('../config/db');

exports.getConversations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT u.id, u.name, u.email FROM messages m JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id) = u.id WHERE m.sender_id = ? OR m.receiver_id = ?',
      [req.user.id, req.user.id, req.user.id]
    );
    const conversations = await Promise.all(rows.map(async (user) => {
      const [lastMsg] = await pool.query(
        'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at DESC LIMIT 1',
        [req.user.id, user.id, user.id, req.user.id]
      );
      const [unread] = await pool.query(
        'SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE',
        [user.id, req.user.id]
      );
      return { user, lastMessage: lastMsg[0] || null, unread: unread[0].count };
    }));
    res.json(conversations);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
      [req.user.id, userId, userId, req.user.id]
    );
    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE',
      [userId, req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = FALSE', [req.user.id]);
    res.json({ count: rows[0].count });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content, ad_id } = req.body;
    if (!receiver_id || !content) return res.status(400).json({ error: 'Destinataire et contenu requis' });
    const [result] = await pool.query(
      'INSERT INTO messages (ad_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)',
      [ad_id || null, req.user.id, receiver_id, content]
    );
    const [msg] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    res.status(201).json(msg[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
