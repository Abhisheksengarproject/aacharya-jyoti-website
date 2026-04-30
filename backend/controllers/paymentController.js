const Razorpay        = require('razorpay');
const crypto          = require('crypto');
const asyncHandler    = require('express-async-handler');
const axios           = require('axios');
const Booking         = require('../models/Booking');

// ─── LAZY Razorpay getter ─────────────────────────────────────────────────────
let _rzp = null;
const getRazorpay = () => {
  if (!_rzp) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing in .env file');
    }
    _rzp = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _rzp;
};

// ─── Service Prices (in paise — ₹1 = 100 paise) ──────────────────────────────
const SERVICE_PRICES = {
  'Kundali Reading':        100,    // ₹1 — TEMPORARY for live testing (change back to 50000 later)
  'Numerology':             40000,  // ₹400
  'Tarot Card Reading':     30000,  // ₹300
  'Vastu Consultation':     80000,  // ₹800
  'Marriage Compatibility': 60000,  // ₹600
  'Career Guidance':        50000,  // ₹500
  'Health Astrology':       50000,  // ₹500
  'Business Astrology':     70000,  // ₹700
};

// ─── Build booking message ────────────────────────────────────────────────────
const buildBookingMessage = (booking, paymentId, amountPaise) => {
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return (
    `🌟 New Booking Confirmed!\n\n` +
    `👤 Name: ${booking.name}\n` +
    `📞 Phone: ${booking.phone}\n` +
    `📧 Email: ${booking.email}\n` +
    `🔮 Service: ${booking.service}\n` +
    `📅 Date: ${dateStr}\n` +
    `⏰ Time: ${booking.time}\n` +
    `💻 Mode: ${booking.mode}\n` +
    `💰 Amount Paid: Rs.${amountPaise / 100}\n` +
    `🧾 Payment ID: ${paymentId}\n` +
    `📝 Booking ID: ${booking._id}\n` +
    (booking.notes ? `📌 Notes: ${booking.notes}\n` : '') +
    `\n🙏 Jai Mata Di! Please confirm the slot.`
  );
};

// ─── Send WhatsApp notification via Green API (FREE, direct to WhatsApp) ────────
const sendWhatsAppNotification = async (message) => {
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token      = process.env.GREEN_API_TOKEN;
  const phone      = process.env.WHATSAPP_PHONE || '919039941589';

  if (!instanceId || !token) {
    console.log('⚠️  WhatsApp notification skipped — GREEN_API credentials not set');
    return false;
  }

  try {
    const url = `https://7107.api.greenapi.com/waInstance${instanceId}/sendMessage/${token}`;
    await axios.post(url, {
      chatId:  `${phone}@c.us`,
      message: message,
    }, { timeout: 15000 });

    console.log('✅ WhatsApp (Green API) notification sent!');
    return true;
  } catch (err) {
    console.error('❌ WhatsApp notification failed:', err.response?.data || err.message);
    return false;
  }
};

// ─── Send Email notification (backup) ─────────────────────────────────────────
const sendBookingEmail = async (booking, paymentId, amountPaise) => {
  try {
    const nodemailer = require('nodemailer');
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo   = process.env.EMAIL_TO || emailUser;

    if (!emailUser || !emailPass || emailPass === 'your_gmail_app_password_here') {
      console.log('⚠️  Email notification skipped — EMAIL_PASS not configured');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    await transporter.sendMail({
      from: `"Aacharya Jyoti Website" <${emailUser}>`,
      to: emailTo,
      subject: `🌟 New Booking: ${booking.service} — ${booking.name} (₹${amountPaise / 100})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1a0a00, #2d1a6e); padding: 24px; text-align: center;">
            <h1 style="color: #f0c040; margin: 0; font-size: 22px;">🌟 New Booking Confirmed!</h1>
            <p style="color: #ccc; margin: 8px 0 0;">Payment Received — ₹${amountPaise / 100}</p>
          </div>
          <div style="padding: 28px; background: #fafafa;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; font-weight: bold; color: #555; width: 140px;">👤 Name</td><td style="padding: 10px; color: #222;">${booking.name}</td></tr>
              <tr style="background:#f0f0f0;"><td style="padding: 10px; font-weight: bold; color: #555;">📞 Phone</td><td style="padding: 10px; color: #222;">${booking.phone}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; color: #555;">📧 Email</td><td style="padding: 10px; color: #222;">${booking.email}</td></tr>
              <tr style="background:#f0f0f0;"><td style="padding: 10px; font-weight: bold; color: #555;">🔮 Service</td><td style="padding: 10px; color: #222;">${booking.service}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; color: #555;">📅 Date</td><td style="padding: 10px; color: #222;">${dateStr}</td></tr>
              <tr style="background:#f0f0f0;"><td style="padding: 10px; font-weight: bold; color: #555;">⏰ Time</td><td style="padding: 10px; color: #222;">${booking.time}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; color: #555;">💻 Mode</td><td style="padding: 10px; color: #222;">${booking.mode}</td></tr>
              <tr style="background:#f0f0f0;"><td style="padding: 10px; font-weight: bold; color: #555;">💰 Amount</td><td style="padding: 10px; color: #222; font-weight: bold;">₹${amountPaise / 100}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; color: #555;">🧾 Payment ID</td><td style="padding: 10px; color: #222;">${paymentId}</td></tr>
              <tr style="background:#f0f0f0;"><td style="padding: 10px; font-weight: bold; color: #555;">📝 Booking ID</td><td style="padding: 10px; color: #222;">${booking._id}</td></tr>
              ${booking.notes ? `<tr><td style="padding: 10px; font-weight: bold; color: #555;">📌 Notes</td><td style="padding: 10px; color: #222;">${booking.notes}</td></tr>` : ''}
            </table>
          </div>
          <div style="background: #eee; padding: 14px; text-align: center; font-size: 12px; color: #888;">
            Sent automatically from Aacharya Jyoti website after payment confirmation.
          </div>
        </div>
      `,
    });

    console.log('✅ Booking email sent!');
    return true;
  } catch (err) {
    console.error('❌ Email notification failed:', err.message);
    return false;
  }
};

// ─── STEP 1: Create Razorpay Order ───────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const { service } = req.body;
  const amount = SERVICE_PRICES[service];
  if (!amount) return res.status(400).json({ message: 'Invalid service selected' });

  const order = await getRazorpay().orders.create({
    amount,
    currency: 'INR',
    receipt:  `rcpt_${Date.now()}`,
    notes:    { service },
  });

  res.json({
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId:    process.env.RAZORPAY_KEY_ID,
  });
});

// ─── STEP 2: Verify Payment & Create Booking ─────────────────────────────────
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData,
  } = req.body;

  // 1. Verify signature
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed — invalid signature.' });
  }

  // 2. Fetch payment details
  const payment = await getRazorpay().payments.fetch(razorpay_payment_id);

  // 3. Save booking to MongoDB
  const booking = await Booking.create({
    ...bookingData,
    status:        'Confirmed',
    paymentId:     razorpay_payment_id,
    orderId:       razorpay_order_id,
    amountPaid:    payment.amount,
    paymentMethod: payment.method,
  });

  // 4. Console log
  console.log('\n🎉 ========== NEW BOOKING ==========');
  console.log(`   Name:    ${booking.name}`);
  console.log(`   Service: ${booking.service}`);
  console.log(`   Date:    ${booking.date}`);
  console.log(`   Time:    ${booking.time}`);
  console.log(`   Amount:  ₹${payment.amount / 100}`);
  console.log(`   Pay ID:  ${razorpay_payment_id}`);
  console.log('====================================\n');

  // 5. Send AUTOMATIC notifications — fire-and-forget
  const message = buildBookingMessage(booking, razorpay_payment_id, payment.amount);

  Promise.allSettled([
    sendWhatsAppNotification(message),
    sendBookingEmail(booking, razorpay_payment_id, payment.amount),
  ]).then((results) => {
    const wa    = results[0].status === 'fulfilled' && results[0].value;
    const email = results[1].status === 'fulfilled' && results[1].value;
    console.log(`📨 Notifications: WhatsApp=${wa ? '✅' : '❌'}, Email=${email ? '✅' : '❌'}`);
  });

  // 6. Respond to customer immediately
  res.status(201).json({
    message:   'Payment verified and booking confirmed!',
    bookingId: booking._id,
    booking,
    payment: {
      id:     razorpay_payment_id,
      amount: payment.amount,
      method: payment.method,
    },
    notified: true,
  });
});

// ─── Webhook ──────────────────────────────────────────────────────────────────
const handleWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const sig    = req.headers['x-razorpay-signature'];

  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expected !== sig) return res.status(400).json({ message: 'Invalid webhook signature' });

  if (req.body.event === 'payment.captured') {
    const paymentId = req.body.payload.payment.entity.id;
    await Booking.findOneAndUpdate({ paymentId }, { status: 'Confirmed' });
  }

  res.json({ received: true });
});

// ─── Get service prices ───────────────────────────────────────────────────────
const getServicePrices = asyncHandler(async (req, res) => {
  const prices = {};
  Object.entries(SERVICE_PRICES).forEach(([k, v]) => { prices[k] = v / 100; });
  res.json(prices);
});

module.exports = { createOrder, verifyPayment, handleWebhook, getServicePrices };
