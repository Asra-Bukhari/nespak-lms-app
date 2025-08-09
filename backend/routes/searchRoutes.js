const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/searchController');
const { auth } = require('../middleware/auth');

router.get('/', auth, ctrl.search);
module.exports = router;
