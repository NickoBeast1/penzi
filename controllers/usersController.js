const database = require ('../db');
// import connection from '../db';



// @DESCRIPTION -- CREATES A USER  

async function createUser(req, res){
  console.log(req.body)
  try {
      const { full_name, age, gender, county, town, phone_number } = req.body;
      const query = `INSERT INTO Users (full_name, age, gender, county, town, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
      
      database.query(query, [full_name, age, gender, county, town, phone_number], (err, result) => {
          if (err) throw err;
          res.status(201).json({ message: 'User created successfully', user_id: result.insertId });
      });
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
};

// DESCRIPTION -- GETS ALL USERS
 
async function getAllUsers(req, res){
  try{
    const query = `SELECT * FROM Users`;
    database.query(query, (err,results) => {
      if(err) throw err;
      res.json(results)
    })
  }catch (error) {
    res.status(404).json({ error: error.message });
  }
}
// DESCRIPTION -- GETS A SINGLE USER
async function getSingleUSer(req, res){
  const {user_id} = req.params;
  const query = `SELECT * FROM Users  WHERE user_id = ?`;

  database.query(query, [user_id], (err, result) =>{
    if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result[0]);
  })
}
//  UPDATES A USER
async function updateUser(req,res) {
  const {user_id} = req.params;
  const {full_name, age, gender, county, town, phone_number} = req.body
  const query = `UPDATE Users SET full_name= ?, age = ?, gender = ?, county = ?, town =?, phone_number= ? WHERE user_id = ?`;

  database.query(query, [full_name, age, gender, county, town, phone_number, user_id], (err, result) =>{
    if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully' });
  })

  }

  // DELETES A USER 
  async function deleteUser(req,res){
    const{user_id} = req.params;
    const query = `   DELETE FROM Users WHERE user_id = ?`;

    database.query(query, [user_id], (err, result) =>{
      if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });

    })
  }

module.exports= {
  createUser,
  getAllUsers,
  getSingleUSer,
  updateUser,
  deleteUser,

}
