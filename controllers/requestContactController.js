const database = require('../db');

function requestContact(req, res) {
  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message are required." });
  }

  // Save the incoming message
  database.query(
    "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
    [sender, message],
    (err) => {
      if (err) {
        console.log("Error inserting incoming message:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Assume the entire message is the phone number (requested contact)
      const requestedPhone = message.trim();

      // Validate phone number format (simple regex: adjust as needed)
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(requestedPhone)) {
        const responseMessage = "Invalid phone number format.";
        database.query(
          "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
          [sender, responseMessage],
          (err) => {
            if (err) console.log("Error inserting outgoing message:", err);
            return res.status(200).json({ response: responseMessage });
          }
        );
        return;
      }

      // Query Users (and Profiles) for details
      const sql = `
        SELECT u.full_name, u.age, u.county, u.town, 
               p.level_of_education, p.profession, p.marital_status, p.religion, p.ethnicity
        FROM Users u
        LEFT JOIN Profiles p ON u.user_id = p.user_id
        WHERE u.phone_number = ?
      `;
      database.query(sql, [requestedPhone], (err, results) => {
        if (err) {
          console.log("Error querying match details:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        let responseMessage = "";
        if (results.length === 0) {
          responseMessage = "No user found with that phone number.";
        } else {
          const detail = results[0];
          responseMessage = `${detail.full_name} aged ${detail.age}, ${detail.county} County, ${detail.town} town, ${detail.level_of_education || "N/A"}, ${detail.profession || "N/A"}, ${detail.marital_status || "N/A"}, ${detail.religion || "N/A"}, ${detail.ethnicity || "N/A"}. Send DESCRIBE ${requestedPhone} to get more details.`;
        }

        // Save outgoing message and respond
        database.query(
          "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
          [sender, responseMessage],
          (err) => {
            if (err) console.log("Error inserting outgoing message:", err);
            return res.status(200).json({ response: responseMessage });
          }
        );
      });
    }
  );
}

module.exports = { requestContact };
