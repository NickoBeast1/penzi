const database = require('../db');

function matchConfirm(req, res) {
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

      // Check if the message is "YES"
      if (message.trim().toUpperCase() !== "YES") {
        const responseMessage = "Invalid command. Please send YES to confirm the match request.";
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

      // First, get the receiver's user_id using the sender's phone number
      database.query(
        "SELECT user_id FROM Users WHERE phone_number = ?",
        [sender],
        (err, userResult) => {
          if (err) {
            console.log("Error fetching user:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          if (userResult.length === 0) {
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

          const receiver_id = userResult[0].user_id;

          // Look up the latest pending request where this user is the receiver
          const requestQuery = `
            SELECT request_id, sender_id 
            FROM Requests 
            WHERE receiver_id = ? AND request_status = 'Pending'
            ORDER BY request_timestamp DESC LIMIT 1
          `;
          database.query(requestQuery, [receiver_id], (err, requestResult) => {
            if (err) {
              console.log("Error querying Requests:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            if (requestResult.length === 0) {
              const responseMessage = "No pending match request found.";
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

            const request_id = requestResult[0].request_id;
            const requester_id = requestResult[0].sender_id;

            // Update the request status to Accepted
            database.query(
              "UPDATE Requests SET request_status = 'Accepted' WHERE request_id = ?",
              [request_id],
              (err, updateResult) => {
                if (err) {
                  console.log("Error updating request:", err);
                  return res.status(500).json({ error: "Internal Server Error" });
                }
                if (updateResult.affectedRows === 0) {
                  const responseMessage = "Failed to update the match request.";
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

                // Retrieve details of the requester (join Users and Profiles)
                const detailQuery = `
                  SELECT u.full_name, u.age, u.county, u.town,
                         p.level_of_education, p.profession, p.marital_status, p.religion, p.ethnicity
                  FROM Users u
                  LEFT JOIN Profiles p ON u.user_id = p.user_id
                  WHERE u.user_id = ?
                `;
                database.query(detailQuery, [requester_id], (err, detailsResult) => {
                  if (err) {
                    console.log("Error retrieving requester details:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                  if (detailsResult.length === 0) {
                    const responseMessage = "Requester details not found.";
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
                  
                  const detail = detailsResult[0];
                  // Construct the response message with the requester's details
                  const responseMessage = `${detail.full_name} aged ${detail.age}, ${detail.county} County, ${detail.town} town, ${detail.level_of_education || "N/A"}, ${detail.profession || "N/A"}, ${detail.marital_status || "N/A"}, ${detail.religion || "N/A"}, ${detail.ethnicity || "N/A"}. Send DESCRIBE ${detail.phone_number || 'the requester phone'} to get more details.`;
                  
                  // Save outgoing message and return response
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
          });
        }
      );
    }
  );
}

module.exports = { matchConfirm };
