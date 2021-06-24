const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  phone: {
    type: String,
    required: [true, "Please Enter a Phone number"],
  },
});

module.exports = mongoose.model("Seller", SellerSchema);
