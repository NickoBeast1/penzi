const database = require('../db');

// CREATE A PROFILE
async function createProfile(req, res) {
    try {
        // console.log("Request Body:", req.body);
        const { user_id, level_of_education, profession, marital_status, religion, ethnicity, self_description } = req.body;

        // Ensure all fields are present
        if (!user_id || !level_of_education || !profession || !marital_status || !religion || !ethnicity || !self_description) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Ensure user exists before creating a profile
        database.query(`SELECT * FROM Users WHERE user_id = ?`, [user_id], async (err, result) =>{
            if(err){
                console.log(err)
                return res.status(500).json({ "Error":err.message });
            }else{
            console.log(result)
            const databaseUser = result;
            if (databaseUser.length === 0) {
                return res.status(404).json({ error: "User Not Found" });
                
            }else{
                console.log("Inserting profile with values:", {
                    user_id,
                    level_of_education,
                    profession,
                    marital_status,
                    religion,
                    ethnicity,
                    self_description
                });
        
                // Insert profile into database
                const sql = `INSERT INTO Profiles (user_id, level_of_education, profession, marital_status, religion, ethnicity, self_description) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
                database.query(sql, [user_id, level_of_education, profession, marital_status, religion, ethnicity, self_description] ,(err, result) =>{
                    if(!err)res.status(201).json({ message: "Profile created successfully" });
                });
        
                

            }
    
    }
        });
        // console.log(rows)
        
        // Debug: Print values before inserting
        

    } catch (error) {
        console.error("Error in createProfile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



// GET PROFILE BY USER_ID
async function getProfile(req, res) {
    try {
        const {user_id}  = req.params;
        console.log(user_id);

        database.query(`SELECT * FROM profiles WHERE user_id = ?`, [user_id] , (err, result) =>{
            if(err){
                console.log(err)
                return res.status(500).json({ "Error":err.message });

            }else{
                const foundProfile = result;
                console.log(result);
                if (foundProfile.length === 0) {
                    return res.status(404).json({ error: "Profile not found" });
                }else{
                    res.status(200).json(foundProfile);
                    
                }
        

            }
        } );


    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// UPDATE PROFILE
async function updateProfile(req, res) {
    try {
        const { user_id } = req.params;
        const { level_of_education, profession, marital_status, religion, ethnicity, self_description } = req.body;

        const sql = `UPDATE Profiles SET level_of_education = ?, profession = ?, marital_status = ?, religion = ?, ethnicity = ?, self_description = ? WHERE user_id = ?`;

        database.query(sql, [level_of_education, profession, marital_status, religion, ethnicity, self_description, user_id],(err,result) =>{
            if(!err){
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Profile not found" });
                }
                res.status(200).json({ message: "Profile updated successfully" });
                
            }else{
                res.status(500).json({ message: err.message });
                

            }
        });

        

    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// DELETE PROFILE
async function deleteProfile(req, res) {
    try {
        const { user_id } = req.params;

        database.query("DELETE FROM Profiles WHERE user_id = ?", [user_id], (err, result) =>{
            if(!err){
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Profile not found" });
                }

                res.status(200).json({ message: "Profile deleted successfully" });

            }else {
                return res.status(500).json({ error: err.message });

            }
        });



    } catch (error) {
        console.error("Error in deleteProfile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// EXPORT CONTROLLERS
module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile
};
