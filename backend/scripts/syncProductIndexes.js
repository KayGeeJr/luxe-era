/**
 * Run after changing Product schema indexes (e.g. removing unique on variants.sku).
 * Usage: node scripts/syncProductIndexes.js
 */
require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const Product = require("../models/Product");

async function main() {
  const mongoUri = (process.env.MONGO_URI || "").trim();
  if (!mongoUri) {
    console.error("MONGO_URI missing");
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  await Product.syncIndexes();
  console.log("Product indexes synced.");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
