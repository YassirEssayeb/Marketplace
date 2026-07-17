const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

router.get('/', auth, ctrl.getNotifications);
router.get('/unread-count', auth, ctrl.getUnreadCount);
router.get('/recent', auth, ctrl.getRecent);
router.put('/read-all', auth, ctrl.markAllAsRead);
router.put('/:id/read', auth, ctrl.markAsRead);
router.delete('/:id', auth, ctrl.deleteNotification);
router.delete('/', auth, ctrl.deleteAll);
router.get('/preferences', auth, ctrl.getPreferences);
router.put('/preferences', auth, ctrl.updatePreferences);

module.exports = router;
