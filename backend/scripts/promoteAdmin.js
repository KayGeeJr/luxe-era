const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config({ override: true });

async function run() {
  const email = (process.argv[2] || "").trim().toLowerCase();
  const name = (process.argv[3] || "Admin User").trim();
  const password = (process.argv[4] || "").trim();
  if (!email) {
    console.error("Usage: npm run promote-admin -- <email> [name] [password]");
    process.exit(1);
  }

  await connectDB();
  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    if (!password) {
      console.error(`No user found for email: ${email}`);
      console.error("Provide name and password to create one:");
      console.error('  npm run promote-admin -- "you@example.com" "Your Name" "StrongPass123"');
      process.exit(1);
    }
    user = await User.create({ name, email, password, isAdmin: true });
    console.log(`Admin user created: ${email}`);
    process.exit(0);
  }

  user.isAdmin = true;
  if (password) user.password = password;
  if (name) user.name = name;
  await user.save();
  console.log(`User promoted to admin: ${email}`);
  process.exit(0);
}

run().catch((error) => {
  console.error("Failed to promote admin:", error.message);
  process.exit(1);
});
