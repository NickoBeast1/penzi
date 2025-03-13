const express = require('express');
const router = express.Router();
const { registerDetails } = require('../controllers/detailsRegistrationController');

// Define the route for details registration
router.post('/details-registration', registerDetails);

module.exports = router;
