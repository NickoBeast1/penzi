const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/sendMessageController');

// Define route for sending messages
router.post('/send-message', sendMessage);

module.exports = router;
