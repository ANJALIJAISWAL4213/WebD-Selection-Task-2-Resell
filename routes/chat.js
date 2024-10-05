const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const requireAuth = require('../middleware/requireAuth');

// Get chat for a specific product
router.get('/:productId/:buyerId/:sellerId', requireAuth, chatController.getChat);

module.exports = router;
