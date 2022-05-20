const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  paid: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      count: {
        type: Number,
        default: 1,
      },
      delivered: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderOf: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  orderAddress: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
