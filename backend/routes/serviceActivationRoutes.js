const express = require('express');
const router = express.Router();
const { activateService } = require('../controllers/serviceActivationController');

// Define route
router.post('/service-activation', activateService);

module.exports = router;
