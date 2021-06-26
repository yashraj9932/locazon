const express = require("express");
const router = express.Router();

const {
  loginPassword,
  loginOtp,
  confirmOtp,
  register,
  updateDetails,
  updateLocation,
  getMe,
} = require("../controllers/authSeller");
const { protectSeller } = require("../middleware/authSeller");

const orderRouter = require("./order");

router.use("/orders", protectSeller, orderRouter);

router.route("/loginpass").post(loginPassword);
router.route("/loginOtp").post(loginOtp);
router.route("/confirmOtp/:phone").post(confirmOtp);
router.route("/register").post(register);
router.route("/updatedetails").put(protectSeller, updateDetails);
router.route("/updateLocation").put(protectSeller, updateLocation);

router.get("/me", protectSeller, getMe);

module.exports = router;
