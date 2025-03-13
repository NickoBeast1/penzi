const express = require('express');
const router = express.Router();
const { getMoreDetails } = require('../controllers/moreDetailsController');

// Define route for "More Details" requests
router.post('/more-details', getMoreDetails);

module.exports = router;
