const Notification = require('../models/notificationModel');

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a notification
const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({ user: userId, message });
    await notification.save();
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
};
