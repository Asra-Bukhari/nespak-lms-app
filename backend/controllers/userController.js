const { sql } = require('../config/db');

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

    const result = await sql.query`
      SELECT user_id, name, email, role
      FROM Users
      WHERE user_id = ${userId}
    `;
    if (!result.recordset.length) return res.status(404).json({ message: "User not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateUserName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const result = await sql.query`
      UPDATE Users
      SET name = ${name}
      WHERE user_id = ${id};
      SELECT user_id, name, email, role FROM Users WHERE user_id = ${id};
    `;

    res.json(result.recordset[0]); // Return updated user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserMe = async (req, res) => {
  try {
    const { user_id } = req.user; // numeric ID from JWT
    const result = await sql.query`
      SELECT user_id, name, email, role
      FROM Users
      WHERE user_id = ${user_id}
    `;
    if (!result.recordset.length) return res.status(404).json({ message: "User not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("getUserMe error:", err);
    res.status(500).json({ message: err.message });
  }
};



exports.searchUsersByEmail = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    const result = await sql.query`
      SELECT TOP 10 user_id, name, email, role
      FROM Users
      WHERE email LIKE ${'%' + q + '%'}
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error("searchUsersByEmail error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Appoint admin (update role)
exports.appointAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const result = await sql.query`
      UPDATE Users
      SET role = 'admin'
      WHERE email = ${email};

      SELECT user_id, name, email, role FROM Users WHERE email = ${email};
    `;

    if (!result.recordset.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User appointed as admin successfully", user: result.recordset[0] });
  } catch (err) {
    console.error("appointAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};