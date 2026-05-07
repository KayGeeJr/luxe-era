const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const { upload } = require("../middleware/upload.middleware");
const {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");

const router = express.Router();

router.get("/", getCollections);
router.get("/:slug", getCollectionBySlug);
router.post("/", protect, admin, upload.single("image"), createCollection);
router.put("/:id", protect, admin, upload.single("image"), updateCollection);
router.delete("/:id", protect, admin, deleteCollection);

module.exports = router;
