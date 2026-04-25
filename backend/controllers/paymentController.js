const Razorpay        = require('razorpay');
const crypto          = require('crypto');
const asyncHandler    = require('express-async-handler');
const axios           = require('axios');
const Booking         = require('../models/Booking');

// ─── LAZY Razorpay getter ─────────────────────────────────────────────────────
// We cannot initialise at module-load time because dotenv hasn't run yet.
// This function creates (and caches) the instance on first real use.
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

// ─── WhatsApp via wa.me deep-link (server-side log + frontend link) ───────────
// We log the booking on server and return a wa.me URL for the frontend to open.
// This works 100% reliably without any third-party API key.
const buildWhatsAppMessage = (booking, paymentId, amountPaise) => {
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return (
    `🌟 *New Booking Confirmed!*\n\n` +
    `👤 *Name:* ${booking.name}\n` +
    `📞 *Phone:* ${booking.phone}\n` +
    `📧 *Email:* ${booking.email}\n` +
    `🔮 *Service:* ${booking.service}\n` +
    `📅 *Date:* ${dateStr}\n` +
    `⏰ *Time:* ${booking.time}\n` +
    `💻 *Mode:* ${booking.mode}\n` +
    `💰 *Amount Paid:* ₹${amountPaise / 100}\n` +
    `🧾 *Payment ID:* ${paymentId}\n` +
    `📝 *Booking ID:* ${booking._id}\n` +
    (booking.notes ? `📌 *Notes:* ${booking.notes}\n` : '') +
    `\n🙏 Jai Mata Di! Please confirm the slot.`
  );
};

// ─── STEP 1: Create Razorpay Order ───────────────────────────────────────────
// @route  POST /api/payments/order
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
// @route  POST /api/payments/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData,
  } = req.body;

  // 1. Verify Razorpay signature (proves payment is genuine)
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed — invalid signature.' });
  }

  // 2. Fetch payment details from Razorpay
  const payment = await getRazorpay().payments.fetch(razorpay_payment_id);

  // 3. Save confirmed booking to MongoDB
  const booking = await Booking.create({
    ...bookingData,
    status:        'Confirmed',
    paymentId:     razorpay_payment_id,
    orderId:       razorpay_order_id,
    amountPaid:    payment.amount,
    paymentMethod: payment.method,
  });

  // 4. Build WhatsApp deep-link for notification
  //    Frontend will open this link so the browser/WhatsApp Web sends the message
  const waText    = encodeURIComponent(buildWhatsAppMessage(booking, razorpay_payment_id, payment.amount));
  const waPhone   = process.env.WHATSAPP_PHONE || '919425024728';
  const waLink    = `https://wa.me/${waPhone}?text=${waText}`;

  // 5. Log to console so admin can see bookings even without WhatsApp automation
  console.log('\n🎉 ========== NEW BOOKING ==========');
  console.log(`   Name:    ${booking.name}`);
  console.log(`   Service: ${booking.service}`);
  console.log(`   Date:    ${booking.date}`);
  console.log(`   Time:    ${booking.time}`);
  console.log(`   Amount:  ₹${payment.amount / 100}`);
  console.log(`   Pay ID:  ${razorpay_payment_id}`);
  console.log('====================================\n');

  res.status(201).json({
    message:   'Payment verified and booking confirmed!',
    bookingId: booking._id,
    booking,
    payment: {
      id:     razorpay_payment_id,
      amount: payment.amount,
      method: payment.method,
    },
    waLink,   // ← frontend opens this to send WhatsApp to Aacharya Jyoti
  });
});

// ─── Webhook (optional — auto-confirms if user closes popup early) ────────────
// @route  POST /api/payments/webhook
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

// ─── Get service prices for frontend display ──────────────────────────────────
// @route  GET /api/payments/prices
const getServicePrices = asyncHandler(async (req, res) => {
  const prices = {};
  Object.entries(SERVICE_PRICES).forEach(([k, v]) => { prices[k] = v / 100; });
  res.json(prices);
});

module.exports = { createOrder, verifyPayment, handleWebhook, getServicePrices };
