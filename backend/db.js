const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database:'penzi'
})

connection.connect(err =>{
    if (err){
        console.error('Database connection failed', err);
        return
    }
    console.log ("Connected to Xampp MYSQL Database");
})

module.exports = connection;