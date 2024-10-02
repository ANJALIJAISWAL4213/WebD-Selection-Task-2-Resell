// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
// });

// module.exports = mongoose.model('Transaction', transactionSchema);



// transactionModel.js
// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   items: [{
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     itemTotal: {
//       type: Number,
//       required: true,
//     }
//   }],
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Transaction', transactionSchema);




// models/transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
