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
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const orderRouter = require("./order");

router.use("/orders", protect, orderRouter);

router.route("/loginpass/user").post(loginPassword);
router.route("/loginOtp/user").post(loginOtp);
router.route("/confirmOtp/user/:phone").post(confirmOtp);
router.route("/register/user").post(register);
router.route("/updatedetails/user").put(protect, updateDetails);
router.route("/updateLocation/user").put(protect, updateLocation);
router.get("/me", protect, getMe);

module.exports = router;
