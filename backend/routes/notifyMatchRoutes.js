const express = require('express');
const router = express.Router();
const { informRequestedPerson } = require('../controllers/notifyMatchController');

// Route for informing the requested person
router.post('/notify-match', informRequestedPerson);

module.exports = router;
