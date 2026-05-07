const Newsletter = require("../models/Newsletter");

async function subscribe(req, res, next) {
  try {
    const { email, source } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("email is required");
    }
    const normalized = String(email).toLowerCase().trim();
    const existing = await Newsletter.findOne({ email: normalized });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.source = source || existing.source;
        await existing.save();
      }
      res.json({ success: true, message: "Already subscribed" });
      return;
    }
    await Newsletter.create({ email: normalized, source });
    console.log("Newsletter subscribe:", normalized);
    res.status(201).json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    next(error);
  }
}

async function subscribers(req, res, next) {
  try {
    const list = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, subscribers: list });
  } catch (error) {
    next(error);
  }
}

async function unsubscribe(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("email is required");
    }
    await Newsletter.findOneAndUpdate(
      { email: String(email).toLowerCase().trim() },
      { $set: { isActive: false } },
      { new: true },
    );
    console.log("Newsletter unsubscribe:", email);
    res.json({ success: true, message: "Unsubscribed" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  subscribe,
  subscribers,
  unsubscribe,
};
