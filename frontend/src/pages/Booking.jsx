import { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaClock, FaArrowRight, FaDownload, FaCheckCircle, FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Booking.css';

/* ─── Constants ─────────────────────────────────────────────────────────── */
const SERVICES = [
  'Kundali Reading', 'Numerology', 'Tarot Card Reading',
  'Vastu Consultation', 'Marriage Compatibility',
  'Career Guidance', 'Health Astrology', 'Business Astrology',
];
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

/* ─── Receipt Download (pure HTML → print) ──────────────────────────────── */
const downloadReceipt = (booking, payment) => {
  const date = booking.date
    ? new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const html = `
    <html>
    <head>
      <title>Booking Receipt</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a2e; }
        .header { text-align: center; border-bottom: 3px solid #d4a843; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #7c3aed; margin: 0; }
        .header p  { color: #666; margin: 4px 0; }
        .badge { background: #d4a843; color: #fff; padding: 4px 16px;
                 border-radius: 20px; font-size: 14px; display: inline-block; margin-top: 8px; }
        .section { margin-bottom: 24px; }
        .section h3 { color: #7c3aed; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .label { font-weight: 600; color: #555; }
        .value { color: #1a1a2e; }
        .total { background: #f5f0ff; padding: 16px; border-radius: 8px;
                 display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; }
        .footer { text-align: center; margin-top: 40px; color: #888; font-size: 13px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔮 Aacharya Jyoti</h1>
        <p>Vedic Astrologer & Spiritual Guide</p>
        <p>✉ jyotisinghsengar1881@gmail.com &nbsp;|&nbsp; 📞 +91 90399 41589</p>
        <div class="badge">✅ BOOKING CONFIRMED</div>
      </div>
      <div class="section">
        <h3>Client Details</h3>
        <div class="row"><span class="label">Name</span><span class="value">${booking.name}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${booking.email}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${booking.phone}</span></div>
      </div>
      <div class="section">
        <h3>Appointment Details</h3>
        <div class="row"><span class="label">Service</span><span class="value">${booking.service}</span></div>
        <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
        <div class="row"><span class="label">Time</span><span class="value">${booking.time}</span></div>
        <div class="row"><span class="label">Mode</span><span class="value">${booking.mode}</span></div>
      </div>
      <div class="section">
        <h3>Payment Details</h3>
        <div class="row"><span class="label">Payment ID</span><span class="value">${payment?.id || 'N/A'}</span></div>
        <div class="row"><span class="label">Booking ID</span><span class="value">${booking.bookingId || ''}</span></div>
        <div class="row"><span class="label">Method</span><span class="value">${payment?.method || 'Online'}</span></div>
        <div class="row"><span class="label">Date & Time</span><span class="value">${new Date().toLocaleString('en-IN')}</span></div>
      </div>
      <div class="total">
        <span>Total Paid</span>
        <span>₹${payment?.amount ? payment.amount / 100 : booking.amountPaid}</span>
      </div>
      <div class="footer">
        <p>Thank you for choosing Aacharya Jyoti 🙏</p>
        <p>This is your official payment receipt. Please keep it for your records.</p>
        <p style="color:#7c3aed; margin-top:8px;">Jai Mata Di ✨</p>
      </div>
    </body>
    </html>
  `;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
};

/* ─── Load Razorpay Script ───────────────────────────────────────────────── */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ─── Booking Page Component ────────────────────────────────────────────── */
const Booking = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '',
    date: '', time: '', mode: 'Online', notes: '',
  });
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // { booking, payment }

  const today = new Date().toISOString().split('T')[0];

  // Fetch service prices from backend on mount
  useEffect(() => {
    api.get('/payments/prices')
      .then(r => setPrices(r.data))
      .catch(() => { }); // silently ignore if API down
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── Main Payment Flow ─────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Load Razorpay checkout SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Razorpay failed to load. Check your internet connection.');
        return;
      }

      // 2. Create order on backend → get orderId + amount
      const { data: order } = await api.post('/payments/order', { service: form.service });

      // 3. Open Razorpay checkout popup
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: RAZORPAY_KEY || order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: 'Aacharya Jyoti',
          description: form.service,
          image: '/favicon.svg',

          // ── Pre-fill customer details ──────────────────────────────
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },

          // ── UPI-first custom checkout layout ──────────────────────
          // Shows UPI (GPay / PhonePe / Paytm / UPI ID) as the first block
          config: {
            display: {
              blocks: {
                upi_block: {
                  name: 'Pay via UPI',
                  instruments: [
                    // UPI apps — Google Pay, PhonePe, Paytm
                    {
                      method: 'upi', flows: ['intent'],
                      apps: ['google_pay', 'phonepe', 'paytm']
                    },
                    // Enter UPI ID manually
                    { method: 'upi', flows: ['collect'] },
                    // UPI QR code
                    { method: 'upi', flows: ['qr'] },
                  ],
                },
                other_block: {
                  name: 'Other Payment Options',
                  instruments: [
                    { method: 'card' },
                    { method: 'netbanking' },
                    { method: 'wallet' },
                  ],
                },
              },
              // UPI shown first, other methods below
              sequence: ['block.upi_block', 'block.other_block'],
              preferences: { show_default_blocks: false },
            },
          },

          theme: { color: '#7c3aed', hide_topbar: false },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled by user')),
            animation: true,
          },

          // ── Payment success handler ────────────────────────────────
          handler: async (response) => {
            try {
              const { data } = await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: form,
              });

              setConfirmed({
                booking: { ...data.booking, bookingId: data.bookingId },
                payment: data.payment,
              });

              // Server now sends WhatsApp + Email notifications automatically
              // No need to open wa.me on customer's phone anymore

              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });
        rzp.open();
      });

    } catch (err) {
      if (err.message !== 'Payment cancelled by user') {
        toast.error(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Confirmation Popup ────────────────────────────────────────────────── */
  if (confirmed) {
    const { booking, payment } = confirmed;
    const dateStr = booking.date
      ? new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    return (
      <div className="page booking">
        <div className="stars-bg" />
        <div className="booking-success-overlay">
          <div className="booking-confirm-popup glass-card">
            {/* Header */}
            <div className="bcp__header">
              <div className="bcp__icon">✅</div>
              <h2 className="bcp__title">Booking Confirmed!</h2>
              <p className="bcp__subtitle">Your slot has been successfully booked & payment received.</p>
            </div>

            {/* Booking ID badge */}
            <div className="bcp__id-badge">
              <span className="bcp__id-label">Booking ID</span>
              <span className="bcp__id-value">{String(booking.bookingId || booking._id).slice(-10).toUpperCase()}</span>
            </div>

            {/* Details grid */}
            <div className="bcp__details">
              <div className="bcp__detail-row">
                <span className="bcp__detail-label">👤 Name</span>
                <span className="bcp__detail-value">{booking.name}</span>
              </div>
              <div className="bcp__detail-row">
                <span className="bcp__detail-label">🔮 Service</span>
                <span className="bcp__detail-value">{booking.service}</span>
              </div>
              <div className="bcp__detail-row">
                <span className="bcp__detail-label">📅 Date</span>
                <span className="bcp__detail-value">{dateStr}</span>
              </div>
              <div className="bcp__detail-row">
                <span className="bcp__detail-label">⏰ Time</span>
                <span className="bcp__detail-value">{booking.time}</span>
              </div>
              <div className="bcp__detail-row">
                <span className="bcp__detail-label">💻 Mode</span>
                <span className="bcp__detail-value">{booking.mode}</span>
              </div>
              <div className="bcp__detail-row bcp__detail-row--payment">
                <span className="bcp__detail-label">💰 Paid</span>
                <span className="bcp__detail-value bcp__amount">
                  ₹{payment?.amount ? payment.amount / 100 : '—'}
                </span>
              </div>
              <div className="bcp__detail-row">
                <span className="bcp__detail-label">🧾 Payment ID</span>
                <span className="bcp__detail-value bcp__pid">{payment?.id}</span>
              </div>
            </div>

            <p className="bcp__whatsapp-note">
              📲 Aacharya Jyoti has been notified instantly. She will confirm the slot shortly.
            </p>

            {/* Actions */}
            <div className="bcp__actions">
              <button
                className="btn btn-primary"
                onClick={() => downloadReceipt(booking, payment)}
              >
                <FaDownload /> Download Receipt
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setConfirmed(null);
                  setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', mode: 'Online', notes: '' });
                }}
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Booking Form ──────────────────────────────────────────────────────── */
  return (
    <div className="page booking">
      <div className="stars-bg" />

      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ Schedule a Session</div>
          <h1 className="section-title">Book a Consultation</h1>
          <div className="divider" />
          <p className="section-subtitle">Fill in your details and pay securely to confirm your slot instantly.</p>
        </div>
      </section>

      <section className="section">
        <div className="container booking-layout">

          {/* Info sidebar */}
          <div className="booking-info">
            <h3>What to Expect</h3>
            {[
              { icon: '🗓️', title: 'Flexible Scheduling', desc: 'Choose from morning to evening slots, 6 days a week.' },
              { icon: '💻', title: 'Online & In-Person', desc: 'Video call via Zoom/WhatsApp or visit in New Delhi.' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Powered by Razorpay — UPI, Cards, Netbanking accepted.' },
              { icon: '⏱️', title: 'Session Duration', desc: 'Most sessions are 30–90 minutes depending on service.' },
            ].map((item) => (
              <div key={item.title} className="booking-info__item glass-card">
                <span className="booking-info__icon">{item.icon}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Payment badges */}
            <div className="booking-payment-badges glass-card">
              <p className="booking-payment-badges__title">Accepted Payments</p>
              <div className="booking-payment-badges__icons">
                {['UPI', 'Cards', 'NetBanking', 'Wallets'].map(m => (
                  <span key={m} className="booking-badge">{m}</span>
                ))}
              </div>
              <img
                src="https://razorpay.com/assets/razorpay-glyph.svg"
                alt="Powered by Razorpay"
                className="booking-razorpay-logo"
                onError={e => e.target.style.display = 'none'}
              />
            </div>
          </div>

          {/* Form */}
          <form className="booking-form glass-card" onSubmit={handleSubmit} id="booking-form">
            <h3 className="booking-form__heading">Your Details</h3>

            <div className="booking-form__row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
            </div>

            <div className="booking-form__row">
              <div className="form-group">
                <label>Phone / WhatsApp *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
              </div>
              <div className="form-group">
                <label>Select Service *</label>
                <select name="service" value={form.service} onChange={handleChange} required>
                  <option value="">-- Choose a service --</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}{prices[s] ? ` — ₹${prices[s]}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price display */}
            {form.service && prices[form.service] && (
              <div className="booking-price-preview">
                <span>💰 Amount to Pay:</span>
                <strong className="booking-price-amount">₹{prices[form.service]}</strong>
                <span className="booking-price-note">Paid securely via Razorpay</span>
              </div>
            )}

            <div className="booking-form__row">
              <div className="form-group">
                <label><FaCalendarAlt /> Preferred Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} min={today} required />
              </div>
              <div className="form-group">
                <label><FaClock /> Preferred Time *</label>
                <select name="time" value={form.time} onChange={handleChange} required>
                  <option value="">-- Select time --</option>
                  {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mode of Consultation</label>
              <div className="booking-mode-btns">
                {['Online', 'In-Person'].map((m) => (
                  <button
                    key={m} type="button"
                    className={`booking-mode-btn ${form.mode === m ? 'booking-mode-btn--active' : ''}`}
                    onClick={() => setForm({ ...form, mode: m })}
                  >
                    {m === 'Online' ? '💻' : '🏠'} {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                placeholder="Share anything you'd like us to know beforehand..." />
            </div>

            <button type="submit" className="btn btn-primary booking-form__submit" disabled={loading} id="pay-book-btn">
              {loading
                ? <><span className="booking-spinner" /> Opening Payment...</>
                : <><FaRupeeSign /> Pay{form.service && prices[form.service] ? ` ₹${prices[form.service]}` : ''} & Confirm Booking</>
              }
            </button>

            <p className="booking-secure-note">
              🔒 Payments secured by Razorpay · Your data is encrypted
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;
