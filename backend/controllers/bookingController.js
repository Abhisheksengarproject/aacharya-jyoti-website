const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

// @desc   Create a booking
// @route  POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, service, date, time, mode, notes } = req.body;
  if (!name || !email || !phone || !service || !date || !time)
    return res.status(400).json({ message: 'Please fill all required fields' });

  const booking = await Booking.create({ name, email, phone, service, date, time, mode, notes });
  res.status(201).json({ message: 'Booking confirmed!', booking });
});

// @desc   Get all bookings (admin)
// @route  GET /api/bookings
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc   Update booking status (admin)
// @route  PUT /api/bookings/:id
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

// @desc   Delete booking (admin)
// @route  DELETE /api/bookings/:id
const deleteBooking = asyncHandler(async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Booking deleted' });
});

module.exports = { createBooking, getBookings, updateBookingStatus, deleteBooking };
