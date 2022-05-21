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
  picture: {
    type: String,
    default: "",
  },
  productOf: {
    type: mongoose.Schema.ObjectId,
    ref: "Seller",
    required: true,
  },

  price: {
    type: Number,
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
  inCartOf: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
  },
});

module.exports = mongoose.model("Product", ProductSchema);
