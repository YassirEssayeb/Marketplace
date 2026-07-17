const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, city) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, phone || null, city || null]
    );
    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: result.insertId, name, email, phone: phone || '', city: city || '', is_admin: false, avatar_url: null }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', city: user.city || '', is_admin: !!user.is_admin, avatar_url: user.avatar_url || null }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.me = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, phone, city, is_admin, created_at, avatar_url, headline, bio FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json(users[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city, headline, bio, avatar_url } = req.body;
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone || null); }
    if (city !== undefined) { fields.push('city = ?'); values.push(city || null); }
    if (headline !== undefined) { fields.push('headline = ?'); values.push(headline || null); }
    if (bio !== undefined) { fields.push('bio = ?'); values.push(bio || null); }
    if (avatar_url !== undefined) { fields.push('avatar_url = ?'); values.push(avatar_url || null); }
    if (fields.length > 0) {
      values.push(req.user.id);
      await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    }
    const [users] = await pool.query('SELECT id, name, email, phone, city, is_admin, created_at, avatar_url, headline, bio FROM users WHERE id = ?', [req.user.id]);
    res.json(users[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, avatar_url, headline, bio, city, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (users.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
    const user = users[0];
    const [ads] = await pool.query(
      'SELECT id, title, price, images, status, created_at FROM ads WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM ads WHERE user_id = ?', [req.params.id]);
    res.json({ ...user, listings: ads.map(a => ({ ...a, images: a.images ? JSON.parse(a.images) : [] })), totalListings: total });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(currentPassword, users[0].password);
    if (!valid) return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);
    await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [token, expires, users[0].id]);
    res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.', resetToken: token });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token et mot de passe requis' });
    const [users] = await pool.query('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
    if (users.length === 0) return res.status(400).json({ error: 'Token invalide ou expiré' });
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashed, users[0].id]);
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
