const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports.sendMail = ({ recepient, subject, text, html }) => {
  // Email options
  const mailOptions = {
    from: "ynov-smpt@outlook.com",
    to: recepient,
    subject,
    text,
    html,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
