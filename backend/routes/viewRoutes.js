const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/viewsController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, ctrl.logView);
router.get('/content/:id', auth, adminOnly, ctrl.getContentViews);
router.get('/user/:id', auth, adminOnly, ctrl.getUserAnalytics);

module.exports = router;
