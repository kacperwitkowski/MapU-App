const nodemailer = require("nodemailer");
const newTransporter = nodemailer.createTransport({
  host: `smtp-mail.outlook.com`,
  port: 587,
  auth: {
    user: process.env.HOTMAIL_USERNAME,
    pass: process.env.HOTMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (options) => {
  const emailOptions = {
    from: "mapuservice@outlook.com",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  newTransporter.sendMail(emailOptions);
};

module.exports = sendEmail;
