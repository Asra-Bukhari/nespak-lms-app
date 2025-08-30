const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.post("/", feedbackController.addFeedback);
router.get("/", feedbackController.getAllFeedback);
router.get("/unread-count", feedbackController.getUnreadCount);
router.patch("/mark-all-read", feedbackController.markAllAsRead);

module.exports = router;
