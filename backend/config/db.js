const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = (process.env.MONGO_URI || "").trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured. Add it to your .env file.");
  }
  if (mongoUri.includes("<db_password>")) {
    throw new Error("MONGO_URI still contains <db_password>. Replace it with your real Atlas password.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
