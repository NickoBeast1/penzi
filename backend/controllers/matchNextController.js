const database = require('../db');
const { getMatchSession, setMatchSession } = require('../sessions');

function handleMatchNext(req, res) {
  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message are required." });
  }

  // Save incoming message
  database.query(
    "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
    [sender, message],
    (err) => {
      if (err) {
        console.log("Error inserting incoming message:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Ensure the command is NEXT
      if (message.trim().toUpperCase() !== "NEXT") {
        const responseMessage = "Invalid command. Please send NEXT to receive more matches.";
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

      // Retrieve session info for the sender
      const session = getMatchSession(sender);
      if (!session) {
        const responseMessage = "No previous match search found. Please send a match request first.";
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

      // Destructure including targetGender
      const { lowerAge, upperAge, town, offset, targetGender } = session;

      // Query for the next 3 matches using the stored criteria with an offset.
      const query = `
        SELECT full_name, age, phone_number 
        FROM Users 
        WHERE gender = ?
          AND age BETWEEN ? AND ?
          AND town = ?
        LIMIT 3 OFFSET ?
      `;
      database.query(query, [targetGender, lowerAge, upperAge, town, offset], (err, results) => {
        if (err) {
          console.log("Error querying next matches:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        let responseMessage = "";

        if (results.length === 0) {
          responseMessage = "No more matches found.Send match phone to get more details about match";
          // Optionally, clear the session if no more matches exist:
          // clearMatchSession(sender);
        } else {
          responseMessage = `Next ${results.length} matches:`;
          results.forEach((match, index) => {
            responseMessage += `\n${offset + index + 1}. ${match.full_name} aged ${match.age}, ${match.phone_number}`;
          });
          // Update the session offset for subsequent NEXT commands
          setMatchSession(sender, {
            lowerAge,
            upperAge,
            town,
            targetGender,
            offset: offset + results.length
          });
          responseMessage += `\nSend NEXT to receive more matches.`;
        }

        // Save outgoing message
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

module.exports = { handleMatchNext };
