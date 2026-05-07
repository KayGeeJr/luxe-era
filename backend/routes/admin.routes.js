const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const {
  dashboard,
  listOrders,
  updateOrder,
  listUsers,
  updateUser,
  inventory,
  listCustomOrders,
} = require("../controllers/admin.controller");

const router = express.Router();

router.use(protect, admin);
router.get("/dashboard", dashboard);
router.get("/orders", listOrders);
router.put("/orders/:id", updateOrder);
router.get("/users", listUsers);
router.put("/users/:id", updateUser);
router.get("/inventory", inventory);
router.get("/custom-orders", listCustomOrders);

module.exports = router;
