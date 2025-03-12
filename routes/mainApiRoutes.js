// routes/mainApiRoutes.js
const express = require('express');
const router = express.Router();
const mainApiController = require('../controllers/mainApiController');

// Define routes that use the mainApiController functions
router.post('/main/service-activation', mainApiController.serviceActivation);
router.post('/main/service-registration', mainApiController.serviceRegistration);
router.post('/main/details-registration', mainApiController.detailsRegistration);
router.post('/main/self-description', mainApiController.selfDescription);
router.post('/main/match-request', mainApiController.matchRequest);
router.post('/main/match-next', mainApiController.matchNext);
router.post('/main/more-details', mainApiController.moreDetails)
router.post('/main/request-contact', mainApiController.requestContact);
router.post('/main/self-description-request', mainApiController.selfDescriptionRequest);
router.post('/main/notify-match', mainApiController.matchNotify);
router.post('/main/match-confirm', mainApiController.matchConfirm);
router.post('/main/send-message', mainApiController.sendMessage);

module.exports = router;
