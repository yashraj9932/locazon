const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
  },
  description: {
    type: String,
    required: [true, "Please enter the description"],
    default: "",
  },
  pictures: {
    type: [String],
  },
  stars: {
    type: Number,
    default: 0,
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

  price: {
    type: String,
    required: [true, "Please enter the product cost"],
  },
  discount: {
    type: String,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
