const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const { createUpload } = require("../middleware/upload.middleware");
const {
  createCustomOrder,
  listCustomOrders,
  updateCustomOrder,
} = require("../controllers/customOrder.controller");

const router = express.Router();
const customUpload = createUpload("anti-store/custom-orders");

router.post("/", customUpload.array("referenceImages", 5), createCustomOrder);
router.get("/", protect, admin, listCustomOrders);
router.put("/:id", protect, admin, updateCustomOrder);

module.exports = router;
