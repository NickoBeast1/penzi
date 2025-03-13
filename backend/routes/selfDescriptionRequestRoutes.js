const express = require('express');
const router = express.Router();
const { describeUser } = require('../controllers/selfDescriptionRequestController');

// Define the route for self-description requests
router.post('/self-description-request', describeUser);

module.exports = router;
