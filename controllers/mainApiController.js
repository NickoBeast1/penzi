// controllers/mainApiController.js
const axios = require('axios');

// Base URL for your locally hosted APIs
const BASE_URL = 'http://localhost:5000/api';

// Each function will simply forward the request to the specific endpoint and return the response

async function serviceActivation(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/service-activation`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi serviceActivation:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function serviceRegistration(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/service-registration`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi serviceRegistration:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function detailsRegistration(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/details-registration`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi detailsRegistration:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function selfDescription(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/self-description`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi selfDescription:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function matchRequest(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/match-request`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi matchRequest:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function matchNext(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/match-next`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi matchNext:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
async function moreDetails(req, res) {
    try {
      const response = await axios.post(`${BASE_URL}/more-details`, req.body);
      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Error in mainApi moreDetails:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

async function requestContact(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/request-contact`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi requestContact:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function selfDescriptionRequest(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/self-description-request`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi selfDescriptionRequest:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
async function matchNotify(req, res) {
    try {
        const response = await axios.post(`${BASE_URL}/notify-match`, req.body);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error in mainApi NotifyMatch:", error.message);
        return res.status(500).json({error: error.message});
    }
}

async function matchConfirm(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/match-confirm`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi matchConfirm:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
async function sendMessage(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/send-message`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in mainApi sendMessage:", error.message);
    return res.status(500).json({ error: error.message });
  }
}




module.exports = {
  serviceActivation,
  serviceRegistration,
  detailsRegistration,
  selfDescription,
  matchRequest,
  matchNext,
  moreDetails,
  requestContact,
  selfDescriptionRequest,
  matchNotify,
  matchConfirm,
  sendMessage,
};
