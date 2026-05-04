const asyncHandler = require('express-async-handler');
const axios        = require('axios');
const Contact      = require('../models/Contact');
const { sendContactNotification } = require('../utils/mailer');

// ─── Send WhatsApp via Green API ──────────────────────────────────────────────
const sendWhatsAppNotification = async (message) => {
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token      = process.env.GREEN_API_TOKEN;
  const phone      = process.env.WHATSAPP_PHONE || '919039941589';

  if (!instanceId || !token) {
    console.log('⚠️  WhatsApp skipped — GREEN_API credentials not set');
    return false;
  }

  try {
    const url = `https://7107.api.greenapi.com/waInstance${instanceId}/sendMessage/${token}`;
    await axios.post(url, {
      chatId:  `${phone}@c.us`,
      message: message,
    }, { timeout: 15000 });
    console.log('✅ WhatsApp contact notification sent!');
    return true;
  } catch (err) {
    console.error('❌ WhatsApp contact notification failed:', err.response?.data || err.message);
    return false;
  }
};

// ─── Build contact message ────────────────────────────────────────────────────
const buildContactMessage = (data) => {
  const { name, email, phone, subject, message } = data;
  return (
    `📩 New Contact Form Inquiry!\n\n` +
    `👤 Name: ${name}\n` +
    `📧 Email: ${email}\n` +
    `📞 Phone: ${phone || 'Not provided'}\n` +
    `📝 Subject: ${subject}\n\n` +
    `💬 Message:\n${message}\n\n` +
    `🙏 Please reply to the customer soon!`
  );
};

// @desc   Submit contact form
// @route  POST /api/contact
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'Please fill required fields' });

  // 1. Save to MongoDB
  const contact = await Contact.create({ name, email, phone, subject, message });

  // 2. Send WhatsApp + Email notifications (fire-and-forget)
  const waMessage = buildContactMessage({ name, email, phone, subject, message });

  Promise.allSettled([
    sendWhatsAppNotification(waMessage),
    sendContactNotification({ name, email, phone, subject, message }).catch((err) => {
      console.error('📧 Email notification failed:', err.message);
    }),
  ]).then((results) => {
    const wa    = results[0].status === 'fulfilled' && results[0].value;
    const email = results[1].status === 'fulfilled';
    console.log(`📨 Contact notifications: WhatsApp=${wa ? '✅' : '❌'}, Email=${email ? '✅' : '❌'}`);
  });

  res.status(201).json({ message: 'Message sent successfully!', contact });
});

// @desc   Get all contacts (admin)
// @route  GET /api/contact
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc   Mark contact as read (admin)
// @route  PUT /api/contact/:id/read
const markRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  res.json(contact);
});

// @desc   Delete contact (admin)
// @route  DELETE /api/contact/:id
const deleteContact = asyncHandler(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Message deleted' });
});

module.exports = { submitContact, getContacts, markRead, deleteContact };
