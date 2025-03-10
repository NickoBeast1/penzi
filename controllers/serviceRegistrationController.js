const database = require('../db');

// Service Registration Function
function registerUser(req, res) {
    const { sender, message } = req.body;

    if (!sender || !message) {
        return res.status(400).json({ error: "Sender and message are required." });
    }

    // Insert incoming message
    database.query(
        "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
        [sender, message],
        (err) => {
            if (err) {
                console.log("Error inserting incoming message:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            // Process registration based on message content
            if (message.toUpperCase().startsWith("START#")) {
                const parts = message.split("#");
                if (parts.length !== 6) {
                    const responseMessage = "Invalid format! Use: start#name#age#gender#county#town";
                    // Save outgoing message and respond
                    database.query(
                        "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                        [sender, responseMessage],
                        (err) => {
                            if (err) console.log("Error inserting outgoing message:", err);
                            return res.status(200).json({ response: responseMessage });
                        }
                    );
                } else {
                    const [_, full_name, age, gender, county, town] = parts;
                    // Check if the user is already registered
                    database.query(
                        "SELECT * FROM Users WHERE phone_number = ?",
                        [sender],
                        (err, existingResult) => {
                            if (err) {
                                console.log("Error checking existing user:", err);
                                return res.status(500).json({ error: "Internal Server Error" });
                            }

                            if (existingResult.length > 0) {
                                const responseMessage = `You are already registered, ${existingResult[0].full_name}.`;
                                // Save outgoing message and respond
                                database.query(
                                    "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
                                    [sender, responseMessage],
                                    (err) => {
                                        if (err) console.log("Error inserting outgoing message:", err);
                                        return res.status(200).json({ response: responseMessage });
                                    }
                                );
                            } else {
                                // Insert new user
                                database.query(
                                    "INSERT INTO Users (full_name, age, gender, county, town, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
                                    [full_name, age, gender, county, town, sender],
                                    (err, userResult) => {
                                        if (err) {
                                            console.log("Error inserting new user:", err);
                                            return res.status(500).json({ error: "Internal Server Error" });
                                        }
                                        const newUserId = userResult.insertId;
                                        // Register in ServiceActivation table
                                        database.query(
                                            "INSERT INTO ServiceActivation (user_id) VALUES (?)",
                                            [newUserId],
                                            (err) => {
                                                if (err) {
                                                    console.log("Error inserting into ServiceActivation:", err);
                                                    return res.status(500).json({ error: "Internal Server Error" });
                                                }
                                                const responseMessage = `Your profile has been created successfully, ${full_name}. SMS: details#education#profession#maritalStatus#religion#ethnicity`;
                                                // Save outgoing message and respond
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
                                    }
                                );
                            }
                        }
                    );
                }
            } else {
                const responseMessage = "Invalid command. Send 'PENZI' to start.";
                // Save outgoing message and respond
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

module.exports = { registerUser };
