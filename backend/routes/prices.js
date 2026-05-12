const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTodayPrices,
  comparePrices,
  getPriceHistory
} = require('../controllers/priceController');

router.get('/today', protect, getTodayPrices);
router.get('/compare', protect, comparePrices);
router.get('/history/:crop', protect, getPriceHistory);

module.exports = router;