const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tagsController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, ctrl.getAllTags);
router.post('/', auth, adminOnly, ctrl.createTag);
router.delete('/:id', auth, adminOnly, ctrl.deleteTag);

router.post('/content/:id', auth, adminOnly, ctrl.addTagsToContent);

module.exports = router;
