const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const CustomOrder = require("../models/CustomOrder");

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function dashboard(req, res, next) {
  try {
    const [totalOrders, totalProducts, totalCustomers, pendingOrders, recentOrders, paidAgg, products] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments({ isActive: true }),
        User.countDocuments({ isAdmin: false }),
        Order.countDocuments({ orderStatus: "processing" }),
        Order.find().sort({ createdAt: -1 }).limit(10),
        Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
        Product.find({ isActive: true }).select("name variants"),
      ]);

    const lowStockProducts = products.filter((p) => (p.variants || []).some((v) => Number(v.stock || 0) < 3));
    res.json({
      success: true,
      totalOrders,
      totalRevenue: paidAgg[0]?.total || 0,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
      totalCustomers,
    });
  } catch (error) {
    next(error);
  }
}

async function listOrders(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.status) query.orderStatus = req.query.status;
    if (req.query.search) {
      const term = escapeRegex(String(req.query.search).trim());
      query.$or = [{ orderNumber: { $regex: term, $options: "i" } }, { guestEmail: { $regex: term, $options: "i" } }];
    }

    const [orders, total] = await Promise.all([
      Order.find(query).populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);
    res.json({ success: true, orders, page, totalPages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (req.body.orderStatus !== undefined) order.orderStatus = req.body.orderStatus;
    if (req.body.trackingNumber !== undefined) order.trackingNumber = req.body.trackingNumber;
    await order.save();
    console.log("Admin updated order:", order.orderNumber);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.search) {
      const term = escapeRegex(String(req.query.search).trim());
      query.$or = [{ name: { $regex: term, $options: "i" } }, { email: { $regex: term, $options: "i" } }];
    }
    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);
    res.json({ success: true, users, page, totalPages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin === true || req.body.isAdmin === "true";
    await user.save();
    console.log("Admin updated user:", user._id.toString());
    res.json({ success: true, user: { id: user._id, isAdmin: user.isAdmin } });
  } catch (error) {
    next(error);
  }
}

async function inventory(req, res, next) {
  try {
    const products = await Product.find({ isActive: true }).select("name slug variants");
    const data = products.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      variants: p.variants || [],
      lowStock: (p.variants || []).some((v) => Number(v.stock || 0) < 3),
    }));
    res.json({ success: true, inventory: data });
  } catch (error) {
    next(error);
  }
}

async function listCustomOrders(req, res, next) {
  try {
    const inquiries = await CustomOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  dashboard,
  listOrders,
  updateOrder,
  listUsers,
  updateUser,
  inventory,
  listCustomOrders,
};
