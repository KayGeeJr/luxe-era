const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const { generatePayfastSignature } = require("../utils/payfastSignature");
const { sendEmail, orderConfirmationEmail } = require("../utils/sendEmail");

// PayFast's published production IP ranges. Keep updated from their docs.
const PAYFAST_VALID_IPS = [
  "41.74.179.194",
  "197.97.145.144",
  "197.97.145.145",
  "197.97.145.146",
  "197.97.145.147",
];

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

function centsToRand(cents) {
  return (Number(cents || 0) / 100).toFixed(2);
}

async function initiatePayment(req, res, next) {
  try {
    const { orderId, guestEmail } = req.body;
    if (!orderId) {
      res.status(400);
      throw new Error("orderId is required");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const isOwner = req.user && order.user && req.user._id.toString() === order.user.toString();
    const guestMatches =
      !order.user &&
      guestEmail &&
      order.guestEmail &&
      String(guestEmail).toLowerCase().trim() === order.guestEmail;
    if (!isOwner && !guestMatches) {
      res.status(403);
      throw new Error("Not authorised for this order");
    }

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${baseUrl}/checkout/success?custom_str1=${order.orderNumber}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled`,
      notify_url: `${backendUrl.replace(/\/$/, "")}/api/payment/notify`,
      m_payment_id: order._id.toString(),
      amount: centsToRand(order.total),
      item_name: `ANTI Order ${order.orderNumber}`,
      custom_str1: order.orderNumber,
      email_address: order.guestEmail || req.user?.email || String(guestEmail || "").toLowerCase().trim(),
    };

    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    paymentData.signature = generatePayfastSignature(paymentData, passphrase);

    const sandbox = String(process.env.PAYFAST_SANDBOX).toLowerCase() === "true";
    const payfastUrl = sandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    res.json({ success: true, payfastUrl, paymentData, order });
  } catch (error) {
    next(error);
  }
}

async function paymentNotify(req, res, next) {
  try {
    const sandbox = String(process.env.PAYFAST_SANDBOX).toLowerCase() === "true";
    if (!sandbox) {
      const clientIp = getClientIp(req);
      if (!PAYFAST_VALID_IPS.includes(clientIp)) {
        res.status(403).send("Forbidden");
        return;
      }
    }

    const data = req.body || {};
    const receivedSignature = data.signature;
    const calculated = generatePayfastSignature(
      { ...data, signature: undefined },
      process.env.PAYFAST_PASSPHRASE || "",
    );

    if (!receivedSignature || receivedSignature !== calculated) {
      res.status(400).send("Invalid signature");
      return;
    }
    if (String(data.merchant_id || "") !== String(process.env.PAYFAST_MERCHANT_ID || "")) {
      res.status(400).send("Merchant mismatch");
      return;
    }

    if (data.payment_status !== "COMPLETE") {
      res.status(200).send("Ignored");
      return;
    }

    const order = await Order.findById(data.m_payment_id);
    if (!order) {
      res.status(404).send("Order not found");
      return;
    }
    if (centsToRand(order.total) !== Number(data.amount_gross).toFixed(2)) {
      res.status(400).send("Amount mismatch");
      return;
    }

    // Idempotency: already processed
    if (order.paymentStatus === "paid") {
      res.status(200).send("OK");
      return;
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payfastToken = data.pf_payment_id;
    await order.save();

    // Send confirmation to guest or logged-in user
    let recipient = order.guestEmail;
    if (!recipient && order.user) {
      const user = await User.findById(order.user).select("email").lean();
      recipient = user?.email;
    }
    if (recipient) {
      sendEmail({ to: recipient, subject: `Order ${order.orderNumber} confirmed`, html: orderConfirmationEmail(order) }).catch(() => {});
    }

    // Clear cart for logged-in user
    if (order.user) {
      const cart = await Cart.findOne({ user: order.user });
      if (cart) { cart.items = []; await cart.save(); }
    }

    res.status(200).send("OK");
  } catch (error) {
    next(error);
  }
}

async function paymentSuccess(req, res, next) {
  try {
    res.json({ success: true, message: "Payment successful", orderId: req.query.order_id });
  } catch (error) {
    next(error);
  }
}

async function paymentCancel(req, res, next) {
  try {
    res.json({ success: true, message: "Payment cancelled" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  initiatePayment,
  paymentNotify,
  paymentSuccess,
  paymentCancel,
};
