const express = require('express');
const router = express.Router();
const { handleMatchNext } = require('../controllers/matchNextController');

// Define route for subsequent matching
router.post('/match-next', handleMatchNext);

module.exports = router;
