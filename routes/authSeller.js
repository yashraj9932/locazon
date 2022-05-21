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
  getSellersInDistance,
  profilePhotoUploadSeller,
  profilePhotoDeleteSeller,
} = require("../controllers/authSeller");
const { protect } = require("../middleware/auth");
const { protectSeller } = require("../middleware/authSeller");

const orderRouter = require("./order");
const productRouter = require("./product");

router.use("/orders", protectSeller, orderRouter);

router.get("/distance/:distance", protect, getSellersInDistance);

router.route("/loginpass").post(loginPassword);
router.route("/loginOtp").post(loginOtp);
router.route("/confirmOtp/:phone").post(confirmOtp);
router.route("/register").post(register);
router.route("/updatedetails").put(protectSeller, updateDetails);
router.route("/updateLocation").put(protectSeller, updateLocation);
router.route("/picadd").put(protectSeller, profilePhotoUploadSeller);
router.route("/picremove").delete(protectSeller, profilePhotoDeleteSeller);

router.get("/me", protectSeller, getMe);

router.use("/:sellerId", protect, productRouter);

module.exports = router;
