const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewsController");

router.post("/get-or-create", viewController.getOrCreateView);
router.post("/update-progress", viewController.updateProgress);
router.post("/mark-complete", viewController.markAsComplete);

module.exports = router;
