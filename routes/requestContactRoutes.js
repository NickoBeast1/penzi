const express = require('express');
const router = express.Router();
const { requestContact } = require('../controllers/requestContactController');

// Define route for request contact
router.post('/request-contact', requestContact);

module.exports = router;
