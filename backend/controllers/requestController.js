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
