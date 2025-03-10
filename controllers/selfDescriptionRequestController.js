const database = require('../db');

function describeUser(req, res) {
  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message are required." });
  }

  // 1️⃣ Save the incoming message
  database.query(
    "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
    [sender, message],
    (err) => {
      if (err) {
        console.log("Error inserting incoming message:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // 2️⃣ Check if the command starts with "DESCRIBE"
      if (!message.toUpperCase().startsWith("DESCRIBE")) {
        const responseMessage = "Invalid command. Please use DESCRIBE followed by the phone number.";
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

      // 3️⃣ Extract phone number from the message
      //    E.g., "DESCRIBE 0702556677" => phoneNumber = "0702556677"
      const phoneNumber = message.substring(8).trim(); // Remove "DESCRIBE" (7 chars) + space

      if (!phoneNumber) {
        const responseMessage = "Please provide a valid phone number after DESCRIBE.";
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

      // 4️⃣ Query the user and their self-description (also get gender)
      const sql = `
        SELECT u.full_name, u.gender, p.self_description
        FROM Users u
        LEFT JOIN Profiles p ON u.user_id = p.user_id
        WHERE u.phone_number = ?
      `;
      database.query(sql, [phoneNumber], (err, results) => {
        if (err) {
          console.log("Error querying user description:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        let responseMessage;
        if (results.length === 0) {
          // No user found
          responseMessage = "No user found with that phone number.";
        } else {
          const { full_name, gender, self_description } = results[0];
          if (!self_description) {
            // If user has no self-description
            responseMessage = `${full_name} has not provided a self-description.`;
          } else {
            // Determine correct pronoun based on gender
            let pronoun = "themselves";
            if (gender && gender.toLowerCase() === "male") {
              pronoun = "himself";
            } else if (gender && gender.toLowerCase() === "female") {
              pronoun = "herself";
            }
            responseMessage = `${full_name} describes ${pronoun} as ${self_description}`;
          }
        }

        // 5️⃣ Save the outgoing message and respond
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

module.exports = { describeUser };
