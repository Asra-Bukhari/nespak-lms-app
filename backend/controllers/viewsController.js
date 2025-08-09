// controllers/viewsController.js
const { sql } = require('../config/db');

exports.logView = async (req, res) => {
  try {
    const { content_id, progress } = req.body;
    if (!content_id) return res.status(400).json({ message: 'content_id required' });
    const user_id = req.user.user_id;

    // Upsert: if exists create or update progress & viewed_at
    // We'll insert a new row each view; for tracking progress per user-content you might update instead
    await sql.query`
      INSERT INTO Views (user_id, content_id, viewed_at, progress)
      VALUES (${user_id}, ${content_id}, GETDATE(), ${progress || 0})
    `;
    res.json({ message: 'View logged' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getContentViews = async (req, res) => {
  try {
    const content_id = parseInt(req.params.id);
    const result = await sql.query`
      SELECT v.*, u.name, u.email FROM Views v
      JOIN Users u ON v.user_id = u.user_id
      WHERE v.content_id = ${content_id} ORDER BY v.viewed_at DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const user_id = parseInt(req.params.id);
    const result = await sql.query`
      SELECT c.content_id, c.title, MAX(v.progress) AS max_progress, COUNT(v.view_id) AS views
      FROM Views v JOIN Content c ON v.content_id = c.content_id
      WHERE v.user_id = ${user_id}
      GROUP BY c.content_id, c.title
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
