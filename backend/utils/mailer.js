const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Gmail App Password (not your normal password)
  },
});

/**
 * Send email notification when contact form is submitted
 * @param {Object} data - { name, email, phone, subject, message }
 */
const sendContactNotification = async (data) => {
  const { name, email, phone, subject, message } = data;

  const mailOptions = {
    from: `"Aacharya Jyoti Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,  // Where you want to receive notifications
    subject: `📩 New Contact Form: ${subject} — from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a0a00, #2d1a6e); padding: 24px; text-align: center;">
          <h1 style="color: #f0c040; margin: 0; font-size: 22px;">✨ New Message Received</h1>
          <p style="color: #ccc; margin: 8px 0 0;">Aacharya Jyoti — Astrology Website</p>
        </div>

        <div style="padding: 28px; background: #fafafa;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #555; width: 140px;">👤 Name</td>
              <td style="padding: 10px; color: #222;">${name}</td>
            </tr>
            <tr style="background:#f0f0f0;">
              <td style="padding: 10px; font-weight: bold; color: #555;">📧 Email</td>
              <td style="padding: 10px; color: #222;"><a href="mailto:${email}" style="color:#2d1a6e;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #555;">📞 Phone</td>
              <td style="padding: 10px; color: #222;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="background:#f0f0f0;">
              <td style="padding: 10px; font-weight: bold; color: #555;">📝 Subject</td>
              <td style="padding: 10px; color: #222;">${subject}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; background: #fff; border-left: 4px solid #f0c040; padding: 16px; border-radius: 4px;">
            <p style="font-weight: bold; color: #555; margin: 0 0 8px;">💬 Message</p>
            <p style="color: #333; margin: 0; line-height: 1.6;">${message}</p>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}" style="background: #2d1a6e; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Reply to ${name}
            </a>
          </div>
        </div>

        <div style="background: #eee; padding: 14px; text-align: center; font-size: 12px; color: #888;">
          This email was sent automatically from your astrology website contact form.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactNotification };
