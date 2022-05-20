const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
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
    unique: true,
  },
  products: {
    type: [mongoose.Schema.ObjectId],
    ref: "Product",
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  otp: {
    type: String,
    default: null,
  },
  orders: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      partOf: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
});

// Encrypt password using bcrypt
SellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
SellerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
SellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Seller", SellerSchema);
