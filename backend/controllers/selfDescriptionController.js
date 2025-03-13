const database = require('../db');

// Self-Description Function
function updateSelfDescription(req, res) {
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
            
            // Check if the message starts with "MYSELF"
            if (!message.toUpperCase().startsWith("MYSELF")) {
                const responseMessage = "Invalid command. Please start your self-description with 'MYSELF'.";
                database.query(
                    "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                    [sender, responseMessage],
                    (err) => {
                        if (err) console.log("Error inserting outgoing message:", err);
                        return res.status(200).json({ response: responseMessage });
                    }
                );
            } else {
                // Remove "MYSELF" prefix and trim the description
                const description = message.substring(6).trim();
                if (!description) {
                    const responseMessage = "Please provide a valid self-description.";
                    database.query(
                        "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                        [sender, responseMessage],
                        (err) => {
                            if (err) console.log("Error inserting outgoing message:", err);
                            return res.status(200).json({ response: responseMessage });
                        }
                    );
                } else {
                    // Attempt to update the self_description in the Profiles table
                    database.query(
                        "UPDATE Profiles SET self_description = ? WHERE user_id = (SELECT user_id FROM Users WHERE phone_number = ?)",
                        [description, sender],
                        (err, result) => {
                            if (err) {
                                console.log("Error updating self_description:", err);
                                return res.status(500).json({ error: "Internal Server Error" });
                            }
                            if (result.affectedRows === 0) {
                                // No profile found; try inserting a new profile record
                                database.query(
                                    "SELECT user_id FROM Users WHERE phone_number = ?",
                                    [sender],
                                    (err, userResult) => {
                                        if (err) {
                                            console.log("Error fetching user:", err);
                                            return res.status(500).json({ error: "Internal Server Error" });
                                        }
                                        if (userResult.length > 0) {
                                            const userId = userResult[0].user_id;
                                            database.query(
                                                "INSERT INTO Profiles (user_id, self_description) VALUES (?, ?)",
                                                [userId, description],
                                                (err, insertResult) => {
                                                    if (err) {
                                                        console.log("Error inserting new profile:", err);
                                                        return res.status(500).json({ error: "Internal Server Error" });
                                                    }
                                                    const responseMessage = "You are now registered for dating. To search for a MPENZI, SMS match#age#town";
                                                    database.query(
                                                        "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                                                        [sender, responseMessage],
                                                        (err) => {
                                                            if (err) console.log("Error inserting outgoing message:", err);
                                                            return res.status(200).json({ response: responseMessage });
                                                        }
                                                    );
                                                }
                                            );
                                        } else {
                                            return res.status(404).json({ response: "User not found. Please register first." });
                                        }
                                    }
                                );
                            } else {
                                // Profile updated successfully
                                const responseMessage = "You are now registered for dating. To search for a MPENZI, SMS match#age#town";
                                database.query(
                                    "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                                    [sender, responseMessage],
                                    (err) => {
                                        if (err) console.log("Error inserting outgoing message:", err);
                                        return res.status(200).json({ response: responseMessage });
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    );
}

module.exports = { updateSelfDescription };
