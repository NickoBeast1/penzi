const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'penzi',
    port: process.env.DB_PORT || 3306
})

connection.connect(err =>{
    if (err){
        console.error('Database connection failed', err);
        return
    }
    console.log ("Connected to Xampp MYSQL Database");
})

module.exports = connection;