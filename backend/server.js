const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adRoutes = require('./routes/ads');
const messageRoutes = require('./routes/messages');
const favoriteRoutes = require('./routes/favorites');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const notificationRoutes = require('./routes/notifications');
const sellerRoutes = require('./routes/sellers');
const commentRoutes = require('./routes/comments');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API Marketplace de petites annonces' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
