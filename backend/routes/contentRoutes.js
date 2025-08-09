const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contentController');
const { auth, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', auth, ctrl.getAllContent);
router.get('/:id', auth, ctrl.getContentById);
router.post('/', auth, adminOnly, upload.single('slide'), ctrl.createContent);
router.put('/:id', auth, adminOnly, ctrl.updateContent);
router.delete('/:id', auth, adminOnly, ctrl.deleteContent);

module.exports = router;
