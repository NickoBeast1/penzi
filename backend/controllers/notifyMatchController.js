const database = require('../db');

async function informRequestedPerson(req, res) {
    try {
        const { requester_phone, requested_phone } = req.body;

        //Validate inputs
        if (!requester_phone || !requested_phone) {
            return res.status(400).json({ error: "Both requester_phone and requested_phone are required." });
        }

        // 2️⃣ (Optional) Save incoming message if you want to track this API call as well
        // database.query(
        //   "INSERT INTO IncomingMessages (sender_phone, message_text) VALUES (?, ?)",
        //   [requester_phone, `Notify request: ${requested_phone}`],
        //   (err) => {
        //     if (err) console.log("Error inserting incoming message:", err);
        //   }
        // );

        // Fetch the requester’s details, including gender
        const [requesterRows] = await queryDb(
            "SELECT full_name, age, county, town, gender FROM Users WHERE phone_number = ?",
            [requester_phone]
        );
        if (requesterRows.length === 0) {
            return res.status(404).json({ error: "Requester not found in the database." });
        }
        const requester = requesterRows[0];

        //Fetch the requested person's details
        const [requestedRows] = await queryDb(
            "SELECT user_id, full_name FROM Users WHERE phone_number = ?",
            [requested_phone]
        );
        if (requestedRows.length === 0) {
            return res.status(404).json({ error: "Requested person not found in the database." });
        }
        const requested = requestedRows[0];

        //Insert a record into Requests table (status = 'Pending')
        const insertRequestSql = `
            INSERT INTO Requests (sender_id, receiver_id, request_status)
            VALUES (
                (SELECT user_id FROM Users WHERE phone_number = ?),
                (SELECT user_id FROM Users WHERE phone_number = ?),
                'Pending'
            )
        `;
        await queryDb(insertRequestSql, [requester_phone, requested_phone]);

        //Determine correct descriptor and pronoun based on the requester’s gender
        let descriptor = "someone called"; // default
        let pronoun = "They";
        if (requester.gender && requester.gender.toLowerCase() === "male") {
            descriptor = "a man called";
            pronoun = "He";
        } else if (requester.gender && requester.gender.toLowerCase() === "female") {
            descriptor = "a woman called";
            pronoun = "She";
        }

        //Construct the message for the requested person
        const responseMessage =
            `Hi ${requested.full_name}, ${descriptor} ${requester.full_name} is interested in you and requested your details.\n` +
            `${pronoun} is aged ${requester.age} based in ${requester.county}.\n` +
            `Do you want to know more about ${pronoun.toLowerCase()}? Send YES to 22141`;

        //Save outgoing message to OutgoingMessages
        database.query(
            "INSERT INTO OutgoingMessages (recipient_phone, message_text) VALUES (?, ?)",
            [requested_phone, responseMessage],
            (err) => {
                if (err) {
                    console.log("Error inserting outgoing message:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
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
