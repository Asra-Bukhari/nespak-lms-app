const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationCodeEmail = async (to, code, name) => {
    await transporter.sendMail({
        from: `"Nespak LMS" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Nespak LMS Verification Code",
        html: `
            <h3>Hello ${name},</h3>
            <p>Your verification code is:</p>
            <h2 style="color: green; letter-spacing: 3px;">${code}</h2>
            <p>This code will expire in 10 minutes.</p>
        `
    });
};

module.exports = { sendVerificationCodeEmail };
