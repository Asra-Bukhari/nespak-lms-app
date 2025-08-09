const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (to, token, name) => {
    const verifyLink = `http://localhost:5000/api/auth/verify/${token}`;

    await transporter.sendMail({
        from: `"Nespak LMS" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verify your Nespak LMS account",
        html: `
            <h3>Welcome to Nespak LMS, ${name}</h3>
            <p>Please verify your account by clicking the link below:</p>
            <a href="${verifyLink}" style="background: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${verifyLink}</p>
        `
    });
};

module.exports = { sendVerificationEmail };
