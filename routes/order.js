const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getOrders,
  createOrder,
  editOrder,
  confirmOrder,
  getCartOrders,
  getCompleteOrders,
  completeOrder,
  deleteOrder,
} = require("../controllers/order");

const { protect } = require("../middleware/auth");
const { protectSeller } = require("../middleware/authSeller");

//actually it is /auth/orders
router.route("/").get(getOrders).post(protect, createOrder);

router.route("/cartEdit").put(protect, editOrder);
router.route("/:id").delete(protect, deleteOrder);
router.route("/confirm").put(protect, confirmOrder);

//actually it is /auth and /authSeller /orders/complete
router.route("/complete").get(getCompleteOrders);

router.put("/:orderId/:productId", protectSeller, completeOrder);

module.exports = router;
