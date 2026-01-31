const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: `"ExternalDashboard" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    html: `
      <h2>Dashboard Login OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `
  });
};
