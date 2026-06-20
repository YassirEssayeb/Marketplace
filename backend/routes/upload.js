const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif|heic|heif|jfif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (!ext) cb(new Error('Format non accepté (jpg, png, gif, webp, avif, heic uniquement)'));
    else cb(null, true);
  }
});

router.post('/', auth, (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Fichier trop volumineux (max 5Mo)' });
      if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Trop de fichiers (max 10)' });
      return res.status(400).json({ error: err.message || 'Erreur upload' });
    }
    try {
      const base = req.protocol + '://' + req.get('host');
      const urls = req.files.map(f => base + '/uploads/' + f.filename);
      res.json({ urls });
    } catch {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
});

module.exports = router;
