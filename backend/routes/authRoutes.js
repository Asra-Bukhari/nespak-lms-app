const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

router.post('/signup', ctrl.signup);
router.get('/verify/:token', ctrl.verifyEmail);
router.post('/login', ctrl.login);

module.exports = router;
