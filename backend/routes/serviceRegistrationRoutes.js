const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/serviceRegistrationController');

// Define route
router.post('/service-registration', registerUser);

module.exports = router;
