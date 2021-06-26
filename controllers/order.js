const asyncHandler = require("../middleware/async");
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.getOrders = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.id) {
    // const orders = await Order.findOne({ orderOf: req.user.id });
    const user = await User.findById(req.user.id).populate("orders");
    res.status(200).json({ success: true, orders: user.orders });
  } else if (req.seller.id) {
    const seller = await Seller.findById(req.seller.id).populate("orders");

    res.status(200).json({ success: true, orders: seller.orders });
  }
});

exports.getActiveSellerOrders = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id);
});

exports.getCompleteSellerOrders = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id);
});

exports.getActiveUserOrders = asyncHandler(async (req, res, next) => {});

exports.getCompleteUserOrders = asyncHandler(async (req, res, next) => {});

exports.createOrder = asyncHandler(async (req, res, next) => {
  if (req.body.products.length === 0) {
    return next(
      new ErrorResponse(
        "Order should atleast have one product with one quantity atleast",
        404
      )
    );
  }
  const { products } = req.body;

  const order = await Order.create({
    products,
    orderOf: req.user.id,
  });

  res.status(200).json({ success: true, order });
});

exports.editOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorResponse("Such ordern does not exist", 404));
  }

  if (req.user.id !== order.orderOf.toString()) {
    return next(new ErrorResponse("Not authorised", 404));
  }

  const product = req.body;
  const { productId, count } = product;

  const ress = await Order.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { products: { product: productId } },
    },
    { new: true, runValidators: true }
  );

  ress.products.push({ product: productId, count });
  ress.save({
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, ress });
});
exports.confirmOrder = asyncHandler(async (req, res, next) => {
  const orderFind = await Order.findById(req.params.id);

  if (!orderFind) {
    return next(new ErrorResponse("No such existing order", 404));
  }

  const order = await Order.findByIdAndUpdate(req.params.id, {
    status: "Active",
    paid: true,
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { orders: order._id } },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, order, user });
});
