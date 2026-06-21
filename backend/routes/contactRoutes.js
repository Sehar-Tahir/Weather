// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitContact, getContacts } = require('../controllers/contactController');

router.post('/', submitContact);           // Public
router.get('/', protect, getContacts);     // Admin only

module.exports = router;