// sessions.js
// This is a simple in-memory session store for match search criteria keyed by sender phone number.
const matchSessions = {};

// Set or update session data for a sender
function setMatchSession(sender, criteria) {
  matchSessions[sender] = criteria;
}

// Retrieve session data for a sender
function getMatchSession(sender) {
  return matchSessions[sender];
}

// Optionally, clear session data for a sender
function clearMatchSession(sender) {
  delete matchSessions[sender];
}

module.exports = {
  setMatchSession,
  getMatchSession,
  clearMatchSession,
};
