const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAlert,
  getMyAlerts,
  deleteAlert
} = require('../controllers/alertController');

// POST /api/alerts → create new alert
router.post('/', protect, createAlert);

// GET /api/alerts → get my alerts
router.get('/', protect, getMyAlerts);

// DELETE /api/alerts/:id → delete alert
router.delete('/:id', protect, deleteAlert);

module.exports = router;