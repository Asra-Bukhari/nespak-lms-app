const express = require('express');
const router = express.Router();
const { sql } = require('../config/db');
const { auth } = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  const userId = req.user.user_id;
  const result = await sql.query`SELECT user_id, name, email, role, is_verified, created_at FROM Users WHERE user_id = ${userId}`;
  res.json(result.recordset[0]);
});

module.exports = router;
