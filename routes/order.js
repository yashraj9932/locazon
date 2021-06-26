const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getOrders,
  createOrder,
  editOrder,
  confirmOrder,
} = require("../controllers/order");

const { protect } = require("../middleware/auth");

router.route("/").get(getOrders).post(protect, createOrder);

router.route("/:id").put(protect, editOrder);
router.route("/:id/confirm").put(protect, confirmOrder);

module.exports = router;
