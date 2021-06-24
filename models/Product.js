const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
  },
  productOf: {
    type: mongoose.Schema.ObjectId,
    ref: "Seller",
    required: true,
  },
  orderedBy: [
    {
      buyer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      buyDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);