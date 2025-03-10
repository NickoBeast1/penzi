const database = require('../db');
const { setMatchSession } = require('../sessions');

function handleMatchRequest(req, res) {
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

      // Verify the command starts with "MATCH#"
      if (!message.toUpperCase().startsWith("MATCH#")) {
        const responseMessage = "Invalid command. Use: match#ageRange#town (e.g., match#26-30#Nairobi)";
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

      // Parse the message into parts: [ 'MATCH', '26-30', 'Nairobi' ]
      const parts = message.split("#");
      if (parts.length !== 3) {
        const responseMessage = "Invalid format! Use: match#ageRange#town (e.g., match#26-30#Nairobi)";
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

      const ageRange = parts[1].trim();
      const town = parts[2].trim();

      // Parse age range
      const ageParts = ageRange.split("-");
      if (ageParts.length !== 2) {
        const responseMessage = "Invalid age range! Use format: match#26-30#town";
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
      const lowerAge = parseInt(ageParts[0].trim());
      const upperAge = parseInt(ageParts[1].trim());
      if (isNaN(lowerAge) || isNaN(upperAge)) {
        const responseMessage = "Age range must be numeric. Use format: match#26-30#town";
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

      // Get the sender's gender to determine target gender
      database.query(
        "SELECT gender FROM Users WHERE phone_number = ?",
        [sender],
        (err, senderResult) => {
          if (err) {
            console.log("Error fetching sender gender:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          if (senderResult.length === 0) {
            const responseMessage = "User not found. Please register first.";
            database.query(
              "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
              [sender, responseMessage],
              (err) => {
                if (err) console.log("Error inserting outgoing message:", err);
                return res.status(404).json({ response: responseMessage });
              }
            );
            return;
          }
          const senderGender = senderResult[0].gender;
          let targetGender = "";
          if (senderGender.toLowerCase() === "male") {
            targetGender = "Female";
          } else if (senderGender.toLowerCase() === "female") {
            targetGender = "Male";
          } else {
            // If gender is "Other" or undefined, you can choose a default or return an error.
            targetGender = "Male"; // Default choice; adjust as needed.
          }

          // First, count total matching records
          const countQuery = `
            SELECT COUNT(*) AS total
            FROM Users 
            WHERE gender = ?
              AND age BETWEEN ? AND ?
              AND town = ?
          `;
          database.query(countQuery, [targetGender, lowerAge, upperAge, town], (err, countResult) => {
            if (err) {
              console.log("Error counting matches:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            const totalMatches = countResult[0].total;

            // Query for the first 3 matches
            const query = `
              SELECT full_name, age, phone_number 
              FROM Users 
              WHERE gender = ?
                AND age BETWEEN ? AND ?
                AND town = ?
              LIMIT 3
            `;
            database.query(query, [targetGender, lowerAge, upperAge, town], (err, results) => {
              if (err) {
                console.log("Error querying matches:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }
              if (results.length === 0) {
                const responseMessage = "No matches found. Please try different criteria.";
                database.query(
                  "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                  [sender, responseMessage],
                  (err) => {
                    if (err) console.log("Error inserting outgoing message:", err);
                    return res.status(200).json({ response: responseMessage });
                  }
                );
              } else {
                let responseMessage = `We have ${totalMatches} matches!\nHere are the first ${results.length}:`;
                results.forEach((match, index) => {
                  responseMessage += `\n${index + 1}. ${match.full_name} aged ${match.age}, ${match.phone_number}`;
                });
                responseMessage += `\nSend NEXT to receive more matches.`;

                // Save the session for subsequent matching
                const session = {
                  lowerAge,
                  upperAge,
                  town,
                  targetGender,
                  offset: results.length,
                };
                setMatchSession(sender, session);

                // Store outgoing message and return the response
                database.query(
                  "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                  [sender, responseMessage],
                  (err) => {
                    if (err) console.log("Error inserting outgoing message:", err);
                    return res.status(200).json({ response: responseMessage });
                  }
                );
              }
            });
          });
        }
      );
    }
  );
}

module.exports = { handleMatchRequest };
