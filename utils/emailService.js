const nodemailer = require('nodemailer');

// Create a test account using Ethereal for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Send email
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = await createTestAccount();
    const info = await transporter.sendMail({
      from: '"Event Ticketing System" <noreply@eventticketing.com>',
      to,
      subject,
      text,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail }; 