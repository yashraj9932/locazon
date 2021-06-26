const asyncHandler = require("../middleware/async");
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc Get Active Orders from both Seller and User point of view
// @route GET /auth/orders and /authSeller/orders
// @access Private

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

// @desc Get Completed Orders from both Seller and User point of view
// @route /auth/orders/complete and /authSeller/orders/complete
// @access Private

exports.getCompleteOrders = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.id) {
    const orders = await Order.find({
      orderOf: req.user.id,
    }).populate("products");

    let reslt = [];
    orders.map((order) => {
      reslt = [
        ...reslt,
        ...order.products.filter((product) => {
          return product.status === "Completed";
        }),
      ];
    });

    res.status(200).json({ success: true, order: reslt });
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
    let reslt = [];
    reslt = seller.orders.filter((order) => {
      return order.status === "Completed";
    });

    res.status(200).json({ success: true, order: reslt });
  }
});

// @desc    Get Products in the User's cart
// @route   /order/cart
// @access  Private
exports.getCartOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    orderOf: req.user.id,
  }).populate("products");

  let reslt = [];
  orders.map((order) => {
    reslt = [
      ...reslt,
      ...order.products.filter((product) => {
        return product.status === "Cart";
      }),
    ];
  });

  res.status(200).json({ success: true, order: reslt });
});

// @desc    To add items in the cart
// @route   /order
// @access  Private

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

// @desc  To edit items in the cart
// @route  /order/:id
// @access Private

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

// @desc To delete order items in cart
// @route /order/:id/
// @access Private

exports.deleteOrder = asyncHandler(async (req, res, next) => {});

// @desc To finally order items in cart
// @route /order/:id/confirm
// @access Private

exports.confirmOrder = asyncHandler(async (req, res, next) => {
  const orderFind = await Order.findById(req.params.id).populate({
    path: "products",
    populate: {
      path: "product",
    },
  });

  if (!orderFind) {
    return next(new ErrorResponse("No such existing order", 404));
  }

  const order = await Order.findByIdAndUpdate(req.params.id, {
    paid: true,
  });

  orderFind.products.map(async (product) => {
    const seller = await Seller.findByIdAndUpdate(
      product.product.productOf,
      {
        $push: {
          orders: {
            product: product.product._id,
            count: product.count,
            partOf: req.params.id,
            status: "Active",
          },
        },
      },
      { new: true, runValidators: true }
    );
  });

  const prod = orderFind.products;
  var i = 0;
  for (i = 0; i < prod.length; i++) {
    if ((prod[i].status = "Cart")) {
      prod[i].status = "Active";
    }
  }

  const ress = await Order.findByIdAndUpdate(req.params.id, {
    products: prod,
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { orders: order._id } },
    { new: true, runValidators: true }
  );

  const seller = await res
    .status(200)
    .json({ success: true, order: ress, user });
});

// @desc To mark order as completed from seller side
// @route  /order/:orderId/:productId
// @access Private
exports.completeOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new ErrorResponse("Order does not exist", 404));
  }
});
