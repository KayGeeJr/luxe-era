const CustomOrder = require("../models/CustomOrder");
const { sendEmail, customOrderConfirmationEmail, adminCustomOrderEmail } = require("../utils/sendEmail");

async function createCustomOrder(req, res, next) {
  try {
    const { name, email, phone, description, measurements, budget } = req.body;
    if (!name || !email || !description) {
      res.status(400);
      throw new Error("name, email and description are required");
    }

    const referenceImages = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));
    const inquiry = await CustomOrder.create({
      name,
      email,
      phone,
      description,
      measurements,
      budget,
      referenceImages,
    });

    sendEmail({ to: email, subject: "ANTI custom order inquiry received", html: customOrderConfirmationEmail(inquiry) }).catch(() => {});
    sendEmail({
      to: process.env.EMAIL_USER || "info@shopanti.online",
      subject: `New custom order inquiry from ${name}`,
      html: adminCustomOrderEmail(inquiry),
    }).catch(() => {});

    console.log("Custom order created:", inquiry._id.toString());
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    next(error);
  }
}

async function listCustomOrders(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const [items, total] = await Promise.all([
      CustomOrder.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CustomOrder.countDocuments(query),
    ]);
    res.json({ success: true, inquiries: items, page, totalPages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    next(error);
  }
}

async function updateCustomOrder(req, res, next) {
  try {
    const inquiry = await CustomOrder.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error("Custom order not found");
    }
    if (req.body.status !== undefined) inquiry.status = req.body.status;
    if (req.body.adminNotes !== undefined) inquiry.adminNotes = req.body.adminNotes;
    await inquiry.save();
    console.log("Custom order updated:", inquiry._id.toString());
    res.json({ success: true, inquiry });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCustomOrder,
  listCustomOrders,
  updateCustomOrder,
};
