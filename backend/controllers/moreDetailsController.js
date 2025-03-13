const database = require('../db');

function getMoreDetails(req, res) {
  const { sender, message } = req.body;

  // 1️⃣ Validate request
  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message are required." });
  }

  // 2️⃣ Save incoming message
  database.query(
    "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
    [sender, message],
    (err) => {
      if (err) {
        console.log("Error inserting incoming message:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // 3️⃣ The entire message is assumed to be a phone number
      const requestedPhone = message.trim();

      // Basic phone validation (adjust as needed)
      const phoneRegex = /^[+0-9\s-]{10,}$/;

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

      // 4️⃣ Query the user’s details from Users + Profiles
      const sql = `
        SELECT 
          u.full_name, u.age, u.county, u.town, 
          p.level_of_education, p.profession, p.marital_status, 
          p.religion, p.ethnicity
        FROM Users u
        LEFT JOIN Profiles p ON u.user_id = p.user_id
        WHERE u.phone_number = ?
      `;
      database.query(sql, [requestedPhone], (err, results) => {
        if (err) {
          console.log("Error querying user details:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        let responseMessage;
        if (results.length === 0) {
          // 5️⃣ No user found
          responseMessage = "No user found with that phone number.";
        } else {
          // 6️⃣ Build the response message
          const detail = results[0];
          // Example: "Maria Mwende aged 28, Nairobi County, Kasarani town, Graduate, Nurse, Single, Christian, Kamba. Send DESCRIBE 0702556677 to get more details about Maria."
          responseMessage = 
            `${detail.full_name} aged ${detail.age}, ` +
            `${detail.county} County, ${detail.town} town, ` +
            `${detail.level_of_education || "N/A"}, ` +
            `${detail.profession || "N/A"}, ` +
            `${detail.marital_status || "N/A"}, ` +
            `${detail.religion || "N/A"}, ` +
            `${detail.ethnicity || "N/A"}. ` +
            `Send DESCRIBE ${requestedPhone} to get more details about ${detail.full_name}.`;
        }

        // 7️⃣ Save outgoing message and respond
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

module.exports = { getMoreDetails };
