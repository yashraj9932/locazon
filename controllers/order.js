const asyncHandler = require("../middleware/async");
const Seller = require("../models/Seller");

exports.getSellerOrders = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id);
});

exports.getUserOrders = asyncHandler(async (req, res, next) => {});
