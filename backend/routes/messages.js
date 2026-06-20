const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/messageController');
router.get('/', auth, ctrl.getConversations);

router.get('/unread-count', auth, ctrl.getUnreadCount);

router.get('/:userId', auth, ctrl.getMessages);

router.post('/', auth, ctrl.sendMessage);
module.exports = router;
