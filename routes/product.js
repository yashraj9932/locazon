const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  getProduct,
  editProduct,
  deleteProduct,
  productPhotoUpload,
} = require("../controllers/product");

const { protectSeller } = require("../middleware/authSeller");

router.route("/").get(getProducts).post(protectSeller, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protectSeller, editProduct)
  .delete(protectSeller, deleteProduct);

router.put("/:id/photo", protectSeller, productPhotoUpload);

module.exports = router;
