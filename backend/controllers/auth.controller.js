const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendEmail, welcomeEmail, resetPasswordEmail } = require("../utils/sendEmail");

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    addresses: user.addresses || [],
    wishlist: user.wishlist || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("name, email and password are required");
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(400);
      throw new Error("Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number");
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      res.status(409);
      throw new Error("Email already in use");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());

    sendEmail({
      to: user.email,
      subject: "Welcome to ANTI",
      html: welcomeEmail(user.name),
    }).catch(() => {});

    res.status(201).json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("currentPassword and newPassword are required");
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    next(error);
  }
}

async function addAddress(req, res, next) {
  try {
    const { label, street, city, province, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (isDefault) {
      user.addresses = user.addresses.map((a) => ({ ...a.toObject(), isDefault: false }));
    }

    user.addresses.push({ label, street, city, province, postalCode, country, isDefault: !!isDefault });
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      res.status(404);
      throw new Error("Address not found");
    }

    const fields = ["label", "street", "city", "province", "postalCode", "country"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) address[f] = req.body[f];
    });
    if (req.body.isDefault === true) {
      user.addresses.forEach((a) => {
        a.isDefault = a._id.toString() === addressId;
      });
    }
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      res.status(404);
      throw new Error("Address not found");
    }
    address.deleteOne();
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("email is required");
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    // Always respond the same way — don't reveal whether the email exists
    if (!user) {
      res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/account/reset-password?token=${rawToken}`;
    sendEmail({
      to: user.email,
      subject: "Reset your ANTI password",
      html: resetPasswordEmail(user.name, resetUrl),
    }).catch(() => {});

    res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400);
      throw new Error("token and password are required");
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(400);
      throw new Error("Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number");
    }

    const hashed = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      res.status(400);
      throw new Error("Reset link is invalid or has expired");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  forgotPassword,
  resetPassword,
};
