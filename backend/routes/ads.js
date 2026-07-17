const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/adController');

router.get('/', ctrl.getAds);
router.get('/categories', ctrl.getCategories);
router.get('/my', auth, ctrl.getMyAds);
router.get('/seller/stats', auth, ctrl.getSellerStats);
router.get('/:id', ctrl.getAd);
router.post('/', auth, ctrl.createAd);
router.put('/:id', auth, ctrl.updateAd);
router.delete('/:id', auth, ctrl.deleteAd);
router.post('/:id/report', auth, ctrl.reportAd);

module.exports = router;
