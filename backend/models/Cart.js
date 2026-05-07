const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantIndex: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true, min: 0 }, // Snapshot in cents at add time
  },
  { timestamps: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    sessionId: { type: String, default: null, index: true },
    items: [cartItemSchema],
    couponCode: { type: String, trim: true },
    discount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
