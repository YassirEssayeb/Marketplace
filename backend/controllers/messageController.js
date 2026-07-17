const pool = require('../config/db');
const { createNotification } = require('./notificationController');

exports.getConversations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT u.id, u.name, u.email, u.avatar_url,
        (SELECT m2.content FROM messages m2 
         WHERE (m2.sender_id = LEAST(m.sender_id, m.receiver_id) AND m2.receiver_id = GREATEST(m.sender_id, m.receiver_id))
            OR (m2.sender_id = GREATEST(m.sender_id, m.receiver_id) AND m2.receiver_id = LEAST(m.sender_id, m.receiver_id))
         ORDER BY m2.created_at DESC LIMIT 1) as last_content,
        (SELECT m2.created_at FROM messages m2 
         WHERE (m2.sender_id = LEAST(m.sender_id, m.receiver_id) AND m2.receiver_id = GREATEST(m.sender_id, m.receiver_id))
            OR (m2.sender_id = GREATEST(m.sender_id, m.receiver_id) AND m2.receiver_id = LEAST(m.sender_id, m.receiver_id))
         ORDER BY m2.created_at DESC LIMIT 1) as last_time,
        (SELECT m2.ad_id FROM messages m2 
         WHERE (m2.sender_id = LEAST(m.sender_id, m.receiver_id) AND m2.receiver_id = GREATEST(m.sender_id, m.receiver_id))
            OR (m2.sender_id = GREATEST(m.sender_id, m.receiver_id) AND m2.receiver_id = LEAST(m.sender_id, m.receiver_id))
         ORDER BY m2.created_at DESC LIMIT 1) as ad_id,
        (SELECT a.title FROM messages m2 LEFT JOIN ads a ON m2.ad_id = a.id
         WHERE (m2.sender_id = LEAST(m.sender_id, m.receiver_id) AND m2.receiver_id = GREATEST(m.sender_id, m.receiver_id))
            OR (m2.sender_id = GREATEST(m.sender_id, m.receiver_id) AND m2.receiver_id = LEAST(m.sender_id, m.receiver_id))
         ORDER BY m2.created_at DESC LIMIT 1) as ad_title
       FROM messages m
       JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = u.id
       WHERE m.sender_id = ? OR m.receiver_id = ?
       ORDER BY last_time DESC`,
      [req.user.id, req.user.id, req.user.id]
    );

    const conversations = await Promise.all(rows.map(async (row) => {
      const [unread] = await pool.query(
        'SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE',
        [row.id, req.user.id]
      );
      return {
        user: { id: row.id, name: row.name, email: row.email, avatar_url: row.avatar_url || null },
        lastMessage: row.last_content ? { content: row.last_content, created_at: row.last_time } : null,
        ad_id: row.ad_id,
        ad_title: row.ad_title,
        unread: unread[0].count
      };
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
    const { receiver_id, content, ad_id, file_url } = req.body;
    if (!receiver_id || (!content && !file_url)) return res.status(400).json({ error: 'Destinataire et contenu requis' });
    const [result] = await pool.query(
      'INSERT INTO messages (ad_id, sender_id, receiver_id, content, file_url) VALUES (?, ?, ?, ?, ?)',
      [ad_id || null, req.user.id, receiver_id, content || '', file_url || null]
    );
    const [msg] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);

    // Create notification for receiver
    const [[sender]] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
    const senderName = sender ? sender.name : 'Un utilisateur';
    let notifTitle = 'Nouveau message';
    let notifMessage = `${senderName} vous a envoyé un message`;
    let notifLink = '/messages';
    if (ad_id) {
      const [[ad]] = await pool.query('SELECT title FROM ads WHERE id = ?', [ad_id]);
      if (ad) {
        notifTitle = 'Nouveau message concernant "' + ad.title + '"';
        notifLink = '/messages';
      }
    }
    await createNotification(receiver_id, 'message', notifTitle, notifMessage, notifLink);

    res.status(201).json(msg[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
