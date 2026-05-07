const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/item/:itemId", removeCartItem);
router.delete("/clear", clearCart);
router.post("/merge", protect, mergeCart);

module.exports = router;
