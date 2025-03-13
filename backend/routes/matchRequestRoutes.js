const express = require('express');
const router = express.Router();
const { handleMatchRequest } = require('../controllers/matchRequestController');

// Define the route for match requests
router.post('/match-request', handleMatchRequest);

module.exports = router;
