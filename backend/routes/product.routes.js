const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const { upload } = require("../middleware/upload.middleware");
const {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  toggleWishlist,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", listProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, admin, upload.array("images", 8), createProduct);
router.put("/:id", protect, admin, upload.array("images", 8), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id/stock", protect, admin, updateStock);
router.post("/:id/wishlist", protect, toggleWishlist);

module.exports = router;
