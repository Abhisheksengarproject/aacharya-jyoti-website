const express = require('express');
const router  = express.Router();
const {
  createOrder,
  verifyPayment,
  handleWebhook,
  getServicePrices,
} = require('../controllers/paymentController');

// Public routes
router.get('/prices',   getServicePrices);  // GET  /api/payments/prices
router.post('/order',   createOrder);        // POST /api/payments/order
router.post('/verify',  verifyPayment);      // POST /api/payments/verify

// Webhook — must use raw body, registered separately in server.js
router.post('/webhook', handleWebhook);      // POST /api/payments/webhook

module.exports = router;
