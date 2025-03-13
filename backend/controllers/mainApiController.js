// controllers/mainApiController.js
const axios = require('axios');

// Base URL for your locally hosted APIs
const BASE_URL = 'http://localhost:5000/api';

/**
 * main - A single function that routes the incoming request
 * to the appropriate Penzi API endpoint based on the message content.
 */
async function main(req, res) {
  try {
    const { sender, message, action } = req.body;

    // Basic validation
    if (!sender || !message) {
      return res.status(400).json({ error: "Sender and message are required." });
    }

    let response; // Will hold the data returned by one of the helper functions

    // Service Activation
    if (message.toUpperCase().includes("PENZI")) {
      // e.g. "PENZI"
      response = await serviceActivation(req, res);

    // Service Registration
    } else if (message.toUpperCase().startsWith("START#")) {
      // e.g. "start#Jamal Jalang’o#29#Male#Mombasa#Bamburi"
      response = await serviceRegistration(req, res);

    // Details Registration
    } else if (message.toUpperCase().startsWith("DETAILS#")) {
      // e.g. "details#graduate#accountant#divorced#muslim#somali"
      response = await detailsRegistration(req, res);

    // Self-Description
    } else if (message.toUpperCase().startsWith("MYSELF")) {
      // e.g. "MYSELF tall, dark and handsome"
      response = await selfDescription(req, res);

    // Match Request
    } else if (message.toUpperCase().startsWith("MATCH#")) {
      // e.g. "match#26-30#Nairobi"
      response = await matchRequest(req, res);

    // Subsequent Matching (NEXT)
    } else if (message.trim().toUpperCase() === "NEXT") {
      // e.g. "NEXT"
      response = await matchNext(req, res);

    // Self-Description Request (DESCRIBE phone)
    } else if (message.toUpperCase().startsWith("DESCRIBE")) {
      // e.g. "DESCRIBE 0702556677"
      response = await selfDescriptionRequest(req, res);

    //  Match Confirmation (YES)
    } else if (message.trim().toUpperCase() === "YES") {
      // e.g. "YES"
      response = await matchConfirm(req, res);

    //  If the message is a plain phone number and the optional "action" equals "notify"
  } else if (message.toUpperCase().startsWith("NOTIFY#")) {
    response = await matchNotify(req, res);
  
  // For a plain phone number without an action, default to "more details"
    } else if (isPhoneNumber(message)) {
      response = await moreDetails(req, res);

    // Fallback / Unknown Command
    } else {
      return res.status(400).json({ response: "Unknown command. Please try again." });
    }

    // Return the response from whichever helper function was called
    return res.status(200).json(response);

  } catch (error) {
    console.error("Error in mainApiController main:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
}

/**
 * isPhoneNumber - allows 10-15 digits, optionally starting with +.
 */
function isPhoneNumber(text) {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(text.trim());
}

/**
 * Helper functions - each calls the appropriate local API endpoint with Axios
 */

// 1. Service Activation
async function serviceActivation(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/service-activation`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi serviceActivation:", error.message);
    throw error;
  }
}

// 2. Service Registration
async function serviceRegistration(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/service-registration`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi serviceRegistration:", error.message);
    throw error;
  }
}

// 3. Details Registration
async function detailsRegistration(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/details-registration`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi detailsRegistration:", error.message);
    throw error;
  }
}

// 4. Self-Description
async function selfDescription(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/self-description`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi selfDescription:", error.message);
    throw error;
  }
}

// 5. Match Request
async function matchRequest(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/match-request`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi matchRequest:", error.message);
    throw error;
  }
}

// 6. Match Next
async function matchNext(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/match-next`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi matchNext:", error.message);
    throw error;
  }
}

// 7. Self-Description Request
async function selfDescriptionRequest(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/self-description-request`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi selfDescriptionRequest:", error.message);
    throw error;
  }
}

// 8. Match Confirmation
async function matchConfirm(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/match-confirm`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi matchConfirm:", error.message);
    throw error;
  }
}

// 9. Match Notify (notify-match)
// 9. Match Notify (NOTIFY#requester_phone#requested_phone)
async function matchNotify(req, res) {
  try {
    const { sender, message } = req.body;

    // Split by "#" expecting exactly 3 parts: ["NOTIFY", "<requester_phone>", "<requested_phone>"]
    const parts = message.split("#");
    if (parts.length !== 3) {
      // Return an object or throw an error - up to you
      return { error: "Invalid format. Use: NOTIFY#requester_phone#requested_phone" };
    }

    const requester_phone = parts[1].trim();
    const requested_phone = parts[2].trim();

    // (Optional) Validate phone numbers if needed
    // if (!isPhoneNumber(requester_phone) || !isPhoneNumber(requested_phone)) {
    //   return { error: "Invalid phone number format." };
    // }

    // Forward the request to /notify-match with the correct JSON structure
    const response = await axios.post(`${BASE_URL}/notify-match`, {
      requester_phone,
      requested_phone
    });

    return response.data;
  } catch (error) {
    console.error("Error in mainApi matchNotify:", error.message);
    // Let the caller (main function) handle the error
    throw error;
  }
}


// 10. More Details
async function moreDetails(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/more-details`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi moreDetails:", error.message);
    throw error;
  }
}

// 11. Request Contact
async function requestContact(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/request-contact`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi requestContact:", error.message);
    throw error;
  }
}

// 12. Send Message
async function sendMessage(req, res) {
  try {
    const response = await axios.post(`${BASE_URL}/send-message`, req.body);
    return response.data;
  } catch (error) {
    console.error("Error in mainApi sendMessage:", error.message);
    throw error;
  }
}

module.exports = {
  main,
  serviceActivation,
  serviceRegistration,
  detailsRegistration,
  selfDescription,
  matchRequest,
  matchNext,
  selfDescriptionRequest,
  matchConfirm,
  matchNotify,
  moreDetails,
  requestContact,
  sendMessage
};
