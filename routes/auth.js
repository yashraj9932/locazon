const express = require("express");
const router = express.Router();

const { loginPassword, loginOtp, register } = require("../controllers/auth");

router.route("/loginpass").post(loginPassword);
router.route("/loginOtp").post(loginOtp);
router.route("/register").post(register);

module.exports = router;
