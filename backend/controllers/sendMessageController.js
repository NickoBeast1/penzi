const database = require('../db');

function sendMessage(req, res) {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
        return res.status(400).json({ error: "Sender, receiver, and message are required." });
    }

    // Look up sender ID using sender's phone number
    database.query(
        "SELECT user_id FROM Users WHERE phone_number = ?",
        [sender],
        (err, senderResults) => {
            if (err) {
                console.log("Error fetching sender:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (senderResults.length === 0) {
                return res.status(404).json({ error: "Sender not found. Please register first." });
            }
            const sender_id = senderResults[0].user_id;

            // Look up receiver ID using receiver's phone number
            database.query(
                "SELECT user_id FROM Users WHERE phone_number = ?",
                [receiver],
                (err, receiverResults) => {
                    if (err) {
                        console.log("Error fetching receiver:", err);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                    if (receiverResults.length === 0) {
                        return res.status(404).json({ error: "Receiver not found." });
                    }
                    const receiver_id = receiverResults[0].user_id;

                    // Insert the message into the Messages table
                    database.query(
                        "INSERT INTO Messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)",
                        [sender_id, receiver_id, message],
                        (err, result) => {
                            if (err) {
                                console.log("Error inserting message:", err);
                                return res.status(500).json({ error: "Internal Server Error" });
                            }
                            const responseMessage = "Message sent successfully.";
                            return res.status(200).json({ response: responseMessage });
                        }
                    );
                }
            );
        }
    );
}

module.exports = { sendMessage };
