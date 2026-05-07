const mongoose = require("mongoose");

const referenceImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false },
);

const customOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    measurements: { type: String, trim: true },
    budget: { type: String, trim: true },
    referenceImages: [referenceImageSchema],
    status: {
      type: String,
      enum: ["new", "in_review", "quoted", "in_progress", "completed", "declined"],
      default: "new",
    },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CustomOrder", customOrderSchema);
