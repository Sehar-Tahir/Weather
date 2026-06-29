// backend/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  submitContact, 
  getContacts, 
  updateContactStatus,
  deleteContact 
} = require('../controllers/contactController');

// Public routes
router.post('/', submitContact);

// Protected routes (Admin only)
router.get('/', protect, getContacts);
router.patch('/:id/status', protect, updateContactStatus);
router.delete('/:id', protect, deleteContact);

module.exports = router;