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
  profilePhotoUploadUser,
  profilePhotoDeleteUser,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const orderRouter = require("./order");

router.use("/orders", protect, orderRouter);

router.route("/loginpass/user").post(loginPassword);
router.route("/loginOtp/user").post(loginOtp);
router.route("/confirmOtp/user").post(confirmOtp);
router.route("/register/user").post(register);
router.route("/updatedetails/user").put(protect, updateDetails);
router.route("/updateLocation/user").put(protect, updateLocation);
router.route("/picadd").put(protect, profilePhotoUploadUser);
router.route("/picremove").delete(protect, profilePhotoDeleteUser);
router.get("/me", protect, getMe);

module.exports = router;
