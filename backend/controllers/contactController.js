const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/mailer');

// @desc   Submit contact form
// @route  POST /api/contact
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'Please fill required fields' });

  // 1. Save to MongoDB
  const contact = await Contact.create({ name, email, phone, subject, message });

  // 2. Send email notification (non-blocking — won't fail the request if email fails)
  sendContactNotification({ name, email, phone, subject, message }).catch((err) => {
    console.error('📧 Email notification failed:', err.message);
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
