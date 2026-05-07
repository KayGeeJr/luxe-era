const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const { subscribe, subscribers, unsubscribe } = require("../controllers/newsletter.controller");

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/subscribers", protect, admin, subscribers);
router.delete("/unsubscribe", unsubscribe);

module.exports = router;
