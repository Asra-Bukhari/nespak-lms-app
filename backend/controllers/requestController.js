const { sql } = require("../config/db");

exports.createRequest = async (req, res) => {
  const { first_name, last_name, email, category } = req.body;

  if (!first_name || !last_name || !email || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await sql.query`
      INSERT INTO Requests (first_name, last_name, email, category)
      VALUES (${first_name}, ${last_name}, ${email}, ${category})
    `;

    res.status(201).json({ message: "Request submitted successfully" });
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllRequests = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT request_id, first_name, last_name, email, category, status, requested_at
      FROM Requests
      ORDER BY requested_at DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("PATCH request received:", { id, status }); 

  try {
    const requestId = parseInt(id);
    await sql.query`
      UPDATE Requests
      SET status = ${status}
      WHERE request_id = ${requestId}
    `;
    console.log(`Request ${requestId} updated to status: ${status}`);
    res.json({ message: "Request updated successfully" });
  } catch (err) {
    console.error("❌ Error updating request:", err);
    res.status(500).json({ message: "Server error" });
  }
};