const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, notificationController.getNotifications); // Get notifications (User only)
router.patch('/read', requireAuth, notificationController.markAsRead); // Mark notifications as read (User only)

module.exports = router;
