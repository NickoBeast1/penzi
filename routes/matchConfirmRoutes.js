const express = require('express');
const router = express.Router();
const { matchConfirm } = require('../controllers/matchConfirmController');

// Define the route for match confirmation
router.post('/match-confirm', matchConfirm);

module.exports = router;
