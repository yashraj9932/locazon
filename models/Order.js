const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  paid: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Active", "Complete", "Cart"],
    default: "Cart",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      count: {
        type: Number,
        default: 0,
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
});

module.exports = mongoose.model("Order", OrderSchema);
