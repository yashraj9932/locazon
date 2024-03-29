const asyncHandler = require("../middleware/async");
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc Get Active Orders from both Seller and User point of view
// @route GET /auth/orders and /authSeller/orders
// @access Private

exports.getOrders = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  if (req.user && req.user.id) {
    // const orders = await Order.findOne({ orderOf: req.user.id });
    const user = await User.findById(req.user.id).populate("orders");
    res.status(200).json({ success: true, orders: user.orders });
  } else if (req.seller.id) {
    const seller = await Seller.findById(req.seller.id).populate("orders");

    res.status(200).json({ success: true, orders: seller.orders });
  }
});

// @desc Get Completed Orders from both Seller and User point of view
// @route /auth/orders/complete and /authSeller/orders/complete
// @access Private

exports.getCompleteOrders = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  if (req.user && req.user.id) {
    const orders = await Order.find({
      orderOf: req.user.id,
    }).populate("products");

    const completeOrders = orders.map((order) => {
      return order.delivered === true ? order : null;
    });

    res.status(200).json({ success: true, completeOrders });
  } else if (req.seller && req.seller.id) {
    const seller = await Seller.findById(req.seller.id)
      .populate({
        path: "orders",
        populate: {
          path: "product",
        },
      })
      .populate({
        path: "orders",
        populate: {
          path: "partOf",
        },
      });
    let result = [];
    result = seller.orders.filter((order) => {
      console.log(order);
      return order.partOf.delivered === true;
    });

    res.status(200).json({ success: true, order: result });
  }
});

// @desc    To add items in the cart
// @route   /order
// @access  Private

exports.createOrder = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  if (req.body.products.length === 0) {
    return next(
      new ErrorResponse(
        "Order should atleast have one product with one quantity atleast",
        404
      )
    );
  }
  if (req.user.products.length !== 0) {
    return next(new ErrorResponse("Cart Already Created", 404));
  }
  const { products } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { products },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, cart: user });
});

// @desc  To edit items in the cart
// @route  /order/:id
// @access Private

exports.editOrder = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  const cart = req.user.products;
  if (cart.length === 0) {
    return next(new ErrorResponse("Cart does not exist", 404));
  }

  const product = req.body;
  const { productId, count } = product;

  const ress = await User.findByIdAndUpdate(
    req.user._id,
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

// @desc To delete order items in cart
// @route /order/:id/
// @access Private

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  const order = await Order.findByIdAndRemove(req.params.id);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { orders: req.params.id },
    },
    { new: true, runValidators: true }
  );
  // order.save();
  res.status(200).json({ success: true, user });
});

// @desc To finally order items in cart
// @route /order/:id/confirm
// @access Private

exports.confirmOrder = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  const finalUser = await User.findById(req.user._id).populate({
    path: "products",
    populate: {
      path: "product",
    },
  });

  const products = finalUser.products;

  if (products.length === 0) {
    return next(new ErrorResponse("No such cart product to confirm", 404));
  }
  let amount = 0;
  for (var i = 0; i < products.length; i++) {
    amount += products[i].product.price;
  }
  //To confirm payment and Order
  const order = await Order.create({
    orderOf: req.user._id,
    products,
    amount,
    paid: true,
  });

  //To give discount
  let sum = 0;
  order.products.map(async (product) => {
    sum +=
      ((100 - parseInt(product.product.discount)) / 100) *
      parseInt(product.product.price) *
      product.count;
    const seller = await Seller.findByIdAndUpdate(
      product.product.productOf,
      {
        $push: {
          orders: {
            product: product.product._id,
            count: product.count,
            partOf: order._id,
          },
        },
      },
      { new: true, runValidators: true }
    );
  });

  // const ress = await Order.findByIdAndUpdate(req.params.id, {
  //   products: prod,
  // });

  sum += parseInt(finalUser.totalSpent);

  await User.findByIdAndUpdate(
    req.user._id,
    { totalSpent: sum },
    { new: true, runValidators: true }
  );

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { products: {} },
    },
    { new: true, runValidators: true }
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { orders: order._id } },
    { new: true, runValidators: true }
  );

  const seller = await res
    .status(200)
    .json({ success: true, order: order, user });
});

// @desc To mark order as completed from seller side
// @route  /order/:orderId/:productId
// @access Private
exports.completeOrder = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Orders']

  let order = await Order.findById(req.params.orderId);
  const productId = req.params.productId;

  if (!order) {
    return next(new ErrorResponse("Order does not exist", 404));
  }

  const finalOrder = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      $set: {
        "products.$[elem].delivered": true,
      },
    },
    {
      arrayFilters: [{ "elem.product": productId }],
    }
  );
  order = await Order.findById(req.params.orderId);
  var i = 0,
    c = 0;
  for (i = 0; i < order.products.length; i++) {
    if (order.products[i].delivered === true) c++;
  }
  if (i + 1 == c) {
    order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { delivered: true } },
      {}
    );
  }
  res.status(200).json({ success: true, order });
});
