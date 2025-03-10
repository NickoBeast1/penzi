const database = require('../db');

// Helper function to store outgoing message and send response
function storeOutgoingMessage(sender, responseMessage, res) {
    database.query(
        "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
        [sender, responseMessage],
        (err, outgoingResult) => {
            if (err) {
                console.log("Error inserting outgoing message:", err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ response: responseMessage });
        }
    );
}

// Service Activation Function
function activateService(req, res) {
    const { sender, message } = req.body;

    if (!sender || !message) {
        return res.status(400).json({ error: "Sender and message are required." });
    }

    // Store the incoming message
    database.query(
        "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
        [sender, message],
        (err, incomingResult) => {
            if (err) {
                console.log("Error inserting incoming message:", err);
                return res.status(500).json({ error: err.message });
            }
            console.log("Incoming message inserted:", incomingResult);

            // Determine the response message based on the incoming message
            if (message.trim().toUpperCase() === "PENZI") {
                // Check if the user is already registered
                database.query(
                    "SELECT user_id FROM Users WHERE phone_number = ?",
                    [sender],
                    (err, userResult) => {
                        if (err) {
                            console.log("Error selecting user:", err);
                            return storeOutgoingMessage(sender, "Internal server error while checking user.", res);
                        }
                        let responseMessage;
                        if (userResult.length > 0) {
                            // User exists
                            responseMessage = "Welcome back! To update your profile, SMS: start#name#age#gender#county#town";
                        } else {
                            // New user
                            responseMessage = "Welcome to our dating service! To register, SMS: start#name#age#gender#county#town";
                        }
                        // Save the outgoing message with the determined response
                        storeOutgoingMessage(sender, responseMessage, res);
                    }
                );
            } else {
                const responseMessage = "Invalid command. Send 'PENZI' to start.";
                storeOutgoingMessage(sender, responseMessage, res);
            }
        }
    );
}

module.exports = { activateService };
