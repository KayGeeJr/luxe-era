const express = require("express");
const rateLimit = require("express-rate-limit");
const { optionalProtect } = require("../middleware/optionalAuth.middleware");
const {
  initiatePayment,
  paymentNotify,
  paymentSuccess,
  paymentCancel,
} = require("../controllers/payment.controller");

const router = express.Router();

const initiateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { success: false, message: "Too many payment requests, try again later." },
});

router.post("/initiate", initiateLimiter, optionalProtect, initiatePayment);
router.post("/notify", paymentNotify);
router.get("/success", paymentSuccess);
router.get("/cancel", paymentCancel);

module.exports = router;
