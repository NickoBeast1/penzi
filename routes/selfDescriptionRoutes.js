const express = require('express');
const router = express.Router();
const { updateSelfDescription } = require('../controllers/selfDescriptionController');

// Define the self-description route
router.post('/self-description', updateSelfDescription);

module.exports = router;
