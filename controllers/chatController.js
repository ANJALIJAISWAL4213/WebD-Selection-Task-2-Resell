const Chat = require('../models/chatModel');

// Function to create or get chat for a product
const getChat = async (req, res) => {
  const { productId, buyerId, sellerId } = req.params;

  try {
    let chat = await Chat.findOne({ productId, buyer: buyerId, seller: sellerId }).populate('messages.sender', 'username'); // Populate sender information
    
    if (!chat) {
      chat = await Chat.create({ productId, buyer: buyerId, seller: sellerId, messages: [] });
    }
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChat,
};
