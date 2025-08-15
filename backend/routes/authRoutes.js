const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

router.post('/signup-request', ctrl.signupRequest);
router.post('/verify-code', ctrl.verifyCodeAndRegister);
router.post('/resend-code', ctrl.resendCode);
router.post('/login', ctrl.login);


module.exports = router;
   