const database = require('../db');

function registerDetails(req, res) {
  const { sender, message } = req.body;
  
  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message are required." });
  }
  
  // Save the incoming message
  database.query(
    "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
    [sender, message],
    (err, incomingResult) => {
      if (err) {
        console.log("Error inserting incoming message:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Incoming message saved:", incomingResult);
      
      // Check that the message starts with "DETAILS#"
      if (!message.toUpperCase().startsWith("DETAILS#")) {
        const responseMessage = "Invalid command. Use: details#education#profession#maritalStatus#religion#ethnicity";
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
      
      // Split the message into parts
      const parts = message.split("#");
      if (parts.length !== 6) {
        const responseMessage = "Invalid format! Use: details#education#profession#maritalStatus#religion#ethnicity";
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
      
      // Extract details
      const [_, education, profession, maritalStatus, religion, ethnicity] = parts;
      
      // Retrieve the user's ID using sender's phone number
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
          
          const userId = userResult[0].user_id;
          
          // Insert or update the profile details in the Profiles table.
          // Assumes that Profiles table has a UNIQUE constraint on user_id.
          const sql = `
            INSERT INTO Profiles (user_id, level_of_education, profession, marital_status, religion, ethnicity)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
              level_of_education = VALUES(level_of_education),
              profession = VALUES(profession),
              marital_status = VALUES(marital_status),
              religion = VALUES(religion),
              ethnicity = VALUES(ethnicity)
          `;
          database.query(
            sql,
            [userId, education, profession, maritalStatus, religion, ethnicity],
            (err, profileResult) => {
              if (err) {
                console.log("Error inserting/updating profile:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }
              const responseMessage = "This is the last stage of registration. SMS a brief description of yourself to 22141 starting with MYSELF.";
              // Save outgoing message
              database.query(
                "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                [sender, responseMessage],
                (err) => {
                  if (err) {
                    console.log("Error inserting outgoing message:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                  return res.status(200).json({ response: responseMessage });
                }
              );
            }
          );
        }
      );
    }
  );
}

module.exports = { registerDetails };
