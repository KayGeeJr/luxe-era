const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendEmail, orderConfirmationEmail, adminNewOrderEmail } = require("../utils/sendEmail");

function getSessionId(req) {
  return req.body?.sessionId || req.query?.sessionId || req.headers["x-session-id"];
}

async function resolveCartForOrder(req, cartId) {
  if (cartId) return Cart.findById(cartId);
  if (req.user) return Cart.findOne({ user: req.user._id });
  const sessionId = getSessionId(req);
  if (!sessionId) return null;
  return Cart.findOne({ sessionId });
}

function computeShipping(subtotal) {
  return subtotal >= 80000 ? 0 : 12000; // cents
}

async function createOrder(req, res, next) {
  try {
    const { shippingAddressId, shippingAddress, cartId, paymentMethod, notes, guestEmail } = req.body;
    const cart = await resolveCartForOrder(req, cartId);
    if (!cart || !cart.items.length) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    let resolvedAddress = shippingAddress;
    if (!resolvedAddress && shippingAddressId && req.user) {
      const user = await User.findById(req.user._id);
      resolvedAddress = user?.addresses?.id(shippingAddressId)?.toObject();
    }
    if (!resolvedAddress) {
      res.status(400);
      throw new Error("shippingAddress is required");
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        res.status(400);
        throw new Error("A cart product is unavailable");
      }
      const variant = product.variants[item.variantIndex];
      if (!variant) {
        res.status(400);
        throw new Error("Invalid variant in cart");
      }

      // Atomically decrement — only succeeds if stock is still sufficient
      const updated = await Product.updateOne(
        {
          _id: product._id,
          [`variants.${item.variantIndex}.stock`]: { $gte: item.quantity },
        },
        { $inc: { [`variants.${item.variantIndex}.stock`]: -item.quantity } },
      );
      if (updated.modifiedCount === 0) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${product.name}${variant.size ? ` (${variant.size})` : ""}`,
        );
      }

      if (item.price !== product.price) item.price = product.price;
      subtotal += item.price * item.quantity;
      orderItems.push({
        product: product._id,
        productName: product.name,
        variantSize: variant.size,
        variantColour: variant.colour,
        quantity: item.quantity,
        price: item.price,
        image: product.images?.[0]?.url,
      });
    }

    const shippingCost = computeShipping(subtotal);
    const discount = cart.discount || 0;
    const total = subtotal + shippingCost - discount;

    const order = await Order.create({
      user: req.user?._id,
      guestEmail: req.user ? undefined : guestEmail,
      items: orderItems,
      shippingAddress: resolvedAddress,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod: paymentMethod || "payfast",
      paymentStatus: "pending",
      notes,
    });

    if (order.paymentMethod === "eft_manual") {
      cart.items = [];
      await cart.save();
      const recipient = req.user?.email || guestEmail;
      if (recipient) {
        sendEmail({ to: recipient, subject: `Order ${order.orderNumber}`, html: orderConfirmationEmail(order) }).catch(() => {});
      }
    }

    sendEmail({
      to: process.env.EMAIL_USER || "info@shopanti.online",
      subject: `New order ${order.orderNumber}`,
      html: adminNewOrderEmail(order),
    }).catch(() => {});

    console.log("Order created:", order.orderNumber);
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

async function getOrderByNumber(req, res, next) {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const isOwner = req.user && order.user && req.user._id.toString() === order.user.toString();
    const guestMatch = !order.user && req.query.email && order.guestEmail === String(req.query.email).toLowerCase();
    if (!isOwner && !guestMatch && !req.user?.isAdmin) {
      res.status(403);
      throw new Error("Not authorised to view this order");
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (!order.user || order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorised to cancel this order");
    }
    if (order.orderStatus !== "processing") {
      res.status(400);
      throw new Error("Only processing orders can be cancelled");
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const idx = product.variants.findIndex(
        (v) => v.size === item.variantSize && v.colour === item.variantColour,
      );
      if (idx >= 0) {
        product.variants[idx].stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "cancelled";
    await order.save();
    console.log("Order cancelled:", order.orderNumber);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  cancelOrder,
};
