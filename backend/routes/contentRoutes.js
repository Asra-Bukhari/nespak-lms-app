const express = require("express");
const router = express.Router();
const {
  getContentBySection,
  getContentById,
  uploadContent,
} = require("../controllers/contentController");

// Routes
// /api/content/section/:sectionId -> fetch all content in a section
router.get("/section/:sectionId", getContentBySection);

// /api/content/:contentId -> fetch single content details
router.get("/:contentId", getContentById);
router.post("/", uploadContent);

module.exports = router;
