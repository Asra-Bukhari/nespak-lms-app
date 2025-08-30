const express = require("express");
const router = express.Router();
const {
  getContentBySection,
  getContentById,
  uploadContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");


router.get("/section/:sectionId", getContentBySection);
router.get("/:contentId", getContentById);
router.post("/", uploadContent);
router.patch("/:contentId", updateContent);
router.delete("/:contentId", deleteContent);

module.exports = router;
