const bcrypt = require('bcryptjs');
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
      user: { id: result.insertId, name, email, phone: phone || '', city: city || '', is_admin: false }
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
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', city: user.city || '', is_admin: !!user.is_admin }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.me = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, phone, city, is_admin, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json(users[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    await pool.query('UPDATE users SET name = ?, phone = ?, city = ? WHERE id = ?', [name, phone || null, city || null, req.user.id]);
    const [users] = await pool.query('SELECT id, name, email, phone, city, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json(users[0]);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
