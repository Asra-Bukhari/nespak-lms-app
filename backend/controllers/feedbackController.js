const sql = require("mssql");

// Add Feedback
exports.addFeedback = async (req, res) => {
  const { user_id, message, topic, rating } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ message: "user_id and message are required" });
  }

  try {
    const pool = await sql.connect();
    await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("message", sql.Text, message)
      .input("topic", sql.VarChar, topic || null)
      .input("rating", sql.Int, rating || null)
      .query(`
        INSERT INTO Feedback (user_id, message, topic, rating)
        VALUES (@user_id, @message, @topic, @rating)
      `);

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllFeedback = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT f.feedback_id, f.message, f.topic, f.rating, f.status, f.created_at, 
             u.name, u.email
      FROM Feedback f
      INNER JOIN Users u ON f.user_id = u.user_id
      ORDER BY 
        CASE WHEN f.status = 'new' THEN 0 ELSE 1 END,  -- new first
        f.created_at DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Count unread feedback
exports.getUnreadCount = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT COUNT(*) as unreadCount FROM Feedback WHERE status = 'new'
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Mark ALL feedback as read 
exports.markAllAsRead = async (req, res) => {
  try {
    const pool = await sql.connect();
    await pool.request().query(`
      UPDATE Feedback
      SET status = 'old', viewed_at = GETDATE()
      WHERE status = 'new'
    `);

    res.json({ message: "All new feedback marked as read" });
  } catch (error) {
    console.error("Error marking feedback as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};
