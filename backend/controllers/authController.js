const bcrypt = require('bcryptjs'); 
const { sql } = require('../config/db');
const { sendVerificationCodeEmail } = require('../utils/email');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' } // 7 days token
  );
};

// Signup Request: send code to email
exports.signupRequest = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    // Check domain
    if (!email.toLowerCase().endsWith('@nespak.com.pk')) {
      return res.status(400).json({ message: 'Only Nespak emails allowed' });
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain letters and numbers' });
    }

    // Check if user exists
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

// Verify code & register user
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
    const insertedUser = await sql.query`
      INSERT INTO Users (name, email, password_hash, role, is_verified)
      OUTPUT inserted.user_id, inserted.role
      VALUES (${record.name}, ${record.email}, ${record.password_hash}, 'viewer', 1)
    `;

    const user = insertedUser.recordset[0];

    // Delete from pending
    await sql.query`DELETE FROM PendingVerifications WHERE email = ${email}`;

    // Generate JWT
    const token = generateToken(user);

    res.json({ message: 'Email verified and account created successfully.', token, user_id: user.user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend code
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

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const userResult = await sql.query`SELECT user_id, password_hash, role, is_verified FROM Users WHERE email = ${email}`;
    if (!userResult.recordset.length)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = userResult.recordset[0];

    if (!user.is_verified)
      return res.status(403).json({ message: "Email not verified yet" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    res.json({ token, user_id: user.user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
