const database = require('../db');

async function informRequestedPerson(req, res) {
    try {
        const { requester_phone, requested_phone } = req.body;

        // 1️⃣ Validate inputs
        if (!requester_phone || !requested_phone) {
            return res.status(400).json({ error: "Both requester_phone and requested_phone are required." });
        }

        // 2️⃣ Save incoming message (optional, if needed)
        //    If you treat this as an API call from your system (not an SMS), you might not store it in IncomingMessages.
        //    But if you do want to store it, uncomment below:
        /*
        database.query(
            "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
            [requester_phone, `Notify request: ${requested_phone}`],
            (err) => {
                if (err) console.log("Error inserting incoming message:", err);
            }
        );
        */

        // 3️⃣ Fetch the requester's details
        const [requesterRows] = await queryDb(
            "SELECT full_name, age, county, town FROM Users WHERE phone_number = ?",
            [requester_phone]
        );
        if (requesterRows.length === 0) {
            return res.status(404).json({ error: "Requester not found in the database." });
        }
        const requester = requesterRows[0];

        // 4️⃣ Fetch the requested person's details
        const [requestedRows] = await queryDb(
            "SELECT user_id, full_name FROM Users WHERE phone_number = ?",
            [requested_phone]
        );
        if (requestedRows.length === 0) {
            return res.status(404).json({ error: "Requested person not found in the database." });
        }
        const requested = requestedRows[0];

        // 5️⃣ Insert a record into Requests table (optional)
        //    This marks the request as "Pending" for the requested person to confirm with "YES".
        const insertRequestSql = `
            INSERT INTO Requests (sender_id, receiver_id, request_status)
            VALUES (
                (SELECT user_id FROM Users WHERE phone_number = ?),
                (SELECT user_id FROM Users WHERE phone_number = ?),
                'Pending'
            )
        `;
        await queryDb(insertRequestSql, [requester_phone, requested_phone]);

        // 6️⃣ Construct the message to be sent to the requested person
        //    Example: "Hi Maria, a man called Jamal is interested in you and requested your details..."
        const responseMessage = 
            `Hi ${requested.full_name}, a man called ${requester.full_name} is interested in you and requested your details.\n` +
            `He is aged ${requester.age} based in ${requester.county}.\n` +
            `Do you want to know more about him? Send YES to 22141`;

        // 7️⃣ Save outgoing message to OutgoingMessages
        database.query(
            "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
            [requested_phone, responseMessage],
            (err) => {
                if (err) {
                    console.log("Error inserting outgoing message:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                // 8️⃣ Send final response
                return res.status(200).json({ response: responseMessage });
            }
        );
    } catch (error) {
        console.error("Error in informRequestedPerson:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Helper function to wrap database.query in a Promise
function queryDb(sql, params) {
    return new Promise((resolve, reject) => {
        database.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve([results]);
        });
    });
}

module.exports = { informRequestedPerson };
