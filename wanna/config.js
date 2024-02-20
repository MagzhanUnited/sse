require("dotenv").config();

module.exports = {
  smtpHost: process.env.SMTP_HOST,
  port: process.env.PORT,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
};
