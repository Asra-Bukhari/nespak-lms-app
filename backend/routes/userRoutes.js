const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getUserById, updateUserName, getUserMe, 
    searchUsersByEmail, appointAdmin } = require('../controllers/userController');

router.get('/:id', getUserById);
router.put('/:id', updateUserName);
router.get("/users/me", auth, getUserMe);  

router.get("/search/email", searchUsersByEmail);
router.post("/appoint-admin", appointAdmin);

module.exports = router;
