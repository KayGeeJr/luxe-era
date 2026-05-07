const mongoose = require("mongoose");

function pad(value, width) {
  return String(value).padStart(width, "0");
}

function buildOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1, 2);
  const d = pad(now.getDate(), 2);
  const random = pad(Math.floor(Math.random() * 100000), 5);
  return `ANTI-${y}${m}${d}-${random}`;
}

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    variantSize: { type: String, trim: true },
    variantColour: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // Snapshot in cents
    image: { type: String },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    province: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, default: buildOrderNumber },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestEmail: { type: String, lowercase: true, trim: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["payfast", "eft_manual"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    payfastToken: { type: String, trim: true },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    trackingNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
