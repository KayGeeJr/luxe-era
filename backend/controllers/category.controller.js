const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("name is required");
    }
    const imageFile = req.files?.image?.[0] || req.file;
    const videoFile = req.files?.video?.[0];
    const image = imageFile ? { url: imageFile.path, publicId: imageFile.filename } : undefined;
    const video = videoFile ? videoFile.path : (req.body.video || undefined);
    const videoPublicId = videoFile ? videoFile.filename : undefined;
    const category = await Category.create({ name, description, image, video, videoPublicId });
    console.log("Created category:", category._id.toString());
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    const products = await Product.find({ category: category._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, category, products });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    if (req.body.name !== undefined) category.name = req.body.name;
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive === true || req.body.isActive === "true";

    const imageFile = req.files?.image?.[0] || req.file;
    const videoFile = req.files?.video?.[0];

    // Handle image upload or removal
    if (imageFile) {
      if (category.image?.publicId) {
        try { await cloudinary.uploader.destroy(category.image.publicId); } catch {}
      }
      category.image = { url: imageFile.path, publicId: imageFile.filename };
    } else if (req.body.removeImage === "true") {
      if (category.image?.publicId) {
        try { await cloudinary.uploader.destroy(category.image.publicId); } catch {}
      }
      category.image = undefined;
    }

    // Handle video upload, URL, or removal
    if (videoFile) {
      if (category.videoPublicId) {
        try { await cloudinary.uploader.destroy(category.videoPublicId, { resource_type: "video" }); } catch {}
      }
      category.video = videoFile.path;
      category.videoPublicId = videoFile.filename;
    } else if (req.body.removeVideo === "true") {
      if (category.videoPublicId) {
        try { await cloudinary.uploader.destroy(category.videoPublicId, { resource_type: "video" }); } catch {}
      }
      category.video = undefined;
      category.videoPublicId = undefined;
    } else if (req.body.video !== undefined) {
      category.video = req.body.video || undefined;
    }

    await category.save();
    console.log("Updated category:", category._id.toString());
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    category.isActive = false;
    await category.save();
    console.log("Archived category:", category._id.toString());
    res.json({ success: true, message: "Category archived" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
