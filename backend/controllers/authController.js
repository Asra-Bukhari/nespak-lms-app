const bcrypt = require('bcryptjs');
const { sql } = require('../config/db');
const { sendVerificationCodeEmail } = require('../utils/email');
const validator = require('validator');

exports.signupRequest = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Only Nespak emails allowed' });
    }

   if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
  return res.status(400).json({ message: 'Password must be at least 8 characters and contain letters and numbers' });
}


    const exists = await sql.query`SELECT user_id FROM Users WHERE email = ${email}`;
    if (exists.recordset.length)
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    // Save in PendingVerifications
    await sql.query`
      MERGE PendingVerifications AS target
      USING (SELECT ${email} AS email) AS src
      ON target.email = src.email
      WHEN MATCHED THEN
        UPDATE SET name=${name}, password_hash=${hashed}, code=${code}, created_at=GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (email, name, password_hash, code) VALUES (${email}, ${name}, ${hashed}, ${code});
    `;

    await sendVerificationCodeEmail(email, code, name);

    res.json({ message: 'Verification code sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyCodeAndRegister = async (req, res) => {
  try {
    const { email, code } = req.body;

    const pending = await sql.query`SELECT * FROM PendingVerifications WHERE email = ${email}`;
    if (!pending.recordset.length)
      return res.status(400).json({ message: 'No pending verification found' });

    const record = pending.recordset[0];
    if (record.code !== code)
      return res.status(400).json({ message: 'Invalid code' });

    // Insert into Users
    await sql.query`
      INSERT INTO Users (name, email, password_hash, role, is_verified)
      VALUES (${record.name}, ${record.email}, ${record.password_hash}, 'viewer', 1)
    `;

    // Delete from pending table
    await sql.query`DELETE FROM PendingVerifications WHERE email = ${email}`;

    res.json({ message: 'Email verified and account created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const pending = await sql.query`SELECT name FROM PendingVerifications WHERE email = ${email}`;
    if (!pending.recordset.length)
      return res.status(400).json({ message: 'No pending verification found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sql.query`UPDATE PendingVerifications SET code = ${code}, created_at=GETDATE() WHERE email = ${email}`;

    await sendVerificationCodeEmail(email, code, pending.recordset[0].name);

    res.json({ message: 'New code sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    // Get user
    const userResult = await sql.query`SELECT user_id, password_hash, is_verified FROM Users WHERE email = ${email}`;
    if (!userResult.recordset.length)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = userResult.recordset[0];

    if (!user.is_verified)
      return res.status(403).json({ message: "Email not verified yet" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Send back user_ida
    res.json({ user_id: user.user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

