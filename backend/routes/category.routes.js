const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const { categoryUploadMiddleware } = require("../middleware/upload.middleware");
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, admin, categoryUploadMiddleware, createCategory);
router.put("/:id", protect, admin, categoryUploadMiddleware, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
