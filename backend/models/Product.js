const mongoose = require("mongoose");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false },
);

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, trim: true },
    colour: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    // Do not use unique here: a multikey unique on variants.*.sku makes SKUs globally unique
    // across all products and triggers E11000 on many legitimate saves (e.g. admin image updates).
    sku: { type: String, trim: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // Stored in cents (e.g. R600.00 = 60000)
    compareAtPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
    images: [imageSchema],
    variants: [variantSchema],
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.virtual("totalStock").get(function totalStock() {
  return (this.variants || []).reduce((sum, variant) => sum + (variant.stock || 0), 0);
});

productSchema.pre("validate", async function onValidate() {
  if (!this.isModified("name") && this.slug) {
    return;
  }

  const base = slugify(this.name);
  if (!base) {
    return;
  }

  let nextSlug = base;
  let counter = 2;
  while (
    await this.constructor.exists({
      slug: nextSlug,
      _id: { $ne: this._id },
    })
  ) {
    nextSlug = `${base}-${counter}`;
    counter += 1;
  }

  this.slug = nextSlug;
});

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
