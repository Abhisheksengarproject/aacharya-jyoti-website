const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: {
      type: String,
      required: true,
      enum: [
        'Kundali Reading',
        'Numerology',
        'Tarot Card Reading',
        'Vastu Consultation',
        'Marriage Compatibility',
        'Career Guidance',
        'Health Astrology',
        'Business Astrology',
      ],
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    mode: {
      type: String,
      enum: ['Online', 'In-Person'],
      default: 'Online',
    },
    notes:         { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    // Payment fields
    paymentId:     { type: String, default: '' },   // Razorpay payment_id
    orderId:       { type: String, default: '' },   // Razorpay order_id
    amountPaid:    { type: Number, default: 0 },    // in paise
    paymentMethod: { type: String, default: '' },   // upi / card / netbanking
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
