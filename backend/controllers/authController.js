const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');
const { sendVerificationEmail } = require('../utils/email');
const validator = require('validator');
require('dotenv').config();

const generateToken = (payload, expiresIn = '24h') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    // domain check
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Only Nespak emails allowed' });
    }
    if (!validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    // existing?
    const exists = await sql.query`SELECT user_id FROM Users WHERE email = ${email}`;
    if (exists.recordset.length)
      return res.status(400).json({ message: 'Email already registered' });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // insert new user (viewer role by default)
    await sql.query`
      INSERT INTO Users (name, email, password_hash, role, is_verified)
      VALUES (${name}, ${email}, ${hashed}, ${'viewer'}, 0)
    `;

    // token + send mail
    const token = generateToken({ email });
    await sendVerificationEmail(email, token, name);

    res.status(201).json({ message: 'Registered. Verify email to activate account.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    await sql.query`UPDATE Users SET is_verified = 1 WHERE email = ${email}`;

    // HTML page with green tick and message
    res.send(`
      <html>
        <head>
          <title>Email Verified</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f9f9f9; }
            .tick { font-size: 80px; color: green; }
            h1 { color: #333; }
            p { font-size: 18px; color: #555; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: green; color: white; text-decoration: none; border-radius: 5px; }
            a:hover { background: darkgreen; }
          </style>
        </head>
        <body>
          <div class="tick">✅</div>
          <h1>Email Verified Successfully!</h1>
          <p>You can now log in and continue.</p>
          <a href="http://localhost:3000/login">Go to Login</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired verification link.');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRes =
      await sql.query`SELECT user_id, name, password_hash, role, is_verified FROM Users WHERE email = ${email}`;
    if (!userRes.recordset.length)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = userRes.recordset[0];
    if (!user.is_verified)
      return res.status(403).json({ message: 'Please verify your email first' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ user_id: user.user_id, role: user.role }, '8h');
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
