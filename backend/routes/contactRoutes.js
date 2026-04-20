const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  markRead,
  deleteContact,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markRead);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
