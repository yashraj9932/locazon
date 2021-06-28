const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getProducts,
  createProduct,
  getProduct,
  editProduct,
  deleteProduct,
  productPhotoUpload,
  productPhotoDelete,
} = require("../controllers/product");

const { protectSeller } = require("../middleware/authSeller");

router.route("/").get(getProducts).post(protectSeller, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protectSeller, editProduct)
  .delete(protectSeller, deleteProduct);

router.put("/:id/photo", protectSeller, productPhotoUpload);
router.put("/:id/photoremove", protectSeller, productPhotoDelete);

module.exports = router;
