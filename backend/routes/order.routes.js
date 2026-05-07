const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  cancelOrder,
} = require("../controllers/order.controller");

const router = express.Router();

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: "Too many orders placed, please try again later." },
});

router.post("/", createOrderLimiter, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderNumber", getOrderByNumber);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
