// sessions.js
const matchSessions = {};

function setMatchSession(sender, criteria) {
  matchSessions[sender] = criteria;
}

function getMatchSession(sender) {
  return matchSessions[sender];
}

function clearMatchSession(sender) {
  delete matchSessions[sender];
}

module.exports = {
  setMatchSession,
  getMatchSession,
  clearMatchSession,
};
