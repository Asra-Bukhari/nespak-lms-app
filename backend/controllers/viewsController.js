const sql = require("mssql");

// Add or get view progress
exports.getOrCreateView = async (req, res) => {
  const { user_id, content_id } = req.body;
  try {
    // check if record exists
    const check = await sql.query`
      SELECT * FROM Views WHERE user_id = ${user_id} AND content_id = ${content_id}
    `;

    if (check.recordset.length === 0) {
      // insert new record with progress = 0
      await sql.query`
        INSERT INTO Views (user_id, content_id, progress)
        VALUES (${user_id}, ${content_id}, 0)
      `;
      return res.json({ progress: 0 });
    }

    return res.json({ progress: check.recordset[0].progress });
  } catch (err) {
    console.error("getOrCreateView error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update progress (only if greater than previous)
exports.updateProgress = async (req, res) => {
  const { user_id, content_id, progress } = req.body;
  try {
    // get current
    const current = await sql.query`
      SELECT progress FROM Views WHERE user_id = ${user_id} AND content_id = ${content_id}
    `;

    if (current.recordset.length === 0) {
      return res.status(404).json({ error: "View record not found" });
    }

    const oldProgress = current.recordset[0].progress;
    if (progress > oldProgress) {
      await sql.query`
        UPDATE Views SET progress = ${progress}, viewed_at = GETDATE()
        WHERE user_id = ${user_id} AND content_id = ${content_id}
      `;
      return res.json({ success: true, progress });
    }

    return res.json({ success: true, progress: oldProgress }); // unchanged
  } catch (err) {
    console.error("updateProgress error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark as completed
exports.markAsComplete = async (req, res) => {
  const { user_id, content_id } = req.body;
  try {
    await sql.query`
      UPDATE Views SET progress = 100, viewed_at = GETDATE()
      WHERE user_id = ${user_id} AND content_id = ${content_id}
    `;
    res.json({ success: true, progress: 100 });
  } catch (err) {
    console.error("markAsComplete error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
