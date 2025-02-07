const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User is Required'],
      ref: 'User'
    },
    cartItems: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Product is Required'],
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is Required'],
        min: 1
      },
      subtotal: {
        type: Number,
        required: [true, 'Subtotal is Required'],
        min: 0
      }
    }],
    totalPrice: {
      type: Number,
      required: [true, 'Total Price is Required'],
      min: 0
    },
    orderedOn: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model('Cart', cartSchema);