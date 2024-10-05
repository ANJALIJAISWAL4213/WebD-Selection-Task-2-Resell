const Notification = require('../models/notificationModel');

// Notify users of a price drop
const notifyPriceDrop = async (userId, product) => {
  const message = `The price of ${product.name} has dropped to ${product.price}.`;
  await createNotification(userId, message);
};

// Notify users of new products in their favorite categories
const notifyNewProduct = async (userId, product) => {
  const message = `New product listed in your favorite category: ${product.name}.`;
  await createNotification(userId, message);
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

module.exports = {
  notifyPriceDrop,
  notifyNewProduct,
};
