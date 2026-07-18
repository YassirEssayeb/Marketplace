const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    const [existing] = await pool.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(200).json({ message: 'Vous êtes déjà inscrit !' });
    }
    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
    res.status(201).json({ message: 'Inscription réussie ! Merci de votre intérêt.' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
