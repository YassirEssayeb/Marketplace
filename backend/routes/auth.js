const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const { register, login, me, updateProfile } = require('../controllers/authController');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Trop de tentatives, réessayez dans 15 minutes' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', auth, me);
router.put('/me', auth, updateProfile);
router.put('/me/password', auth, require('../controllers/authController').changePassword);
router.post('/forgot-password', require('../controllers/authController').forgotPassword);
router.post('/reset-password', require('../controllers/authController').resetPassword);

module.exports = router;
