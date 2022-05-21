const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const geocoder = require("../utils/geocoder");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
    index: true,
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
    unique: true,
    required: [true, "Please Enter a Phone number"],
  },
  totalSpent: {
    type: String,
    default: 0,
  },
  orders: {
    type: [mongoose.Schema.ObjectId],
    ref: "Order",
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
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  profilepicture: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: null,
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
    },
  ],
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Geocode & create location field
UserSchema.pre("save", async function (next) {
  // this.location = {
  //   type: "Point",
  //   coordinates: [loc[0].longitude, loc[0].latitude],
  //   formattedAddress: loc[0].formattedAddress,
  //   street: loc[0].streetName,
  //   city: loc[0].city,
  //   state: loc[0].stateCode,
  //   zipcode: loc[0].zipcode,
  //   country: loc[0].countryCode,
  // };

  // Do not save address in DB
  this.address = undefined;
  next();
});

module.exports = mongoose.model("User", UserSchema);
