const nodemailer = require("nodemailer");
const config = require("./config.js");

module.exports = async function sendmail(subject, body, email) {
  let transporter = nodemailer.createTransport({
    host: config.smtpHost,
    secure: true,
    auth: {
      user: `${config.user}`,
      pass: `${config.password}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    to: email,
    subject: subject,
    text: "",
    html: body,
  });

  console.log("Message sent: %s", info.messageId);
};
