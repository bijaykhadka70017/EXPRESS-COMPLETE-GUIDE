const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',       // The server address (local machine)
    user: 'root',            // Default administrator username
    database: 'node-complete', // The specific schema/database name
    password: 'Bijay@1995' // The password set during MySQL installation
});

// Exporting with .promise() allows for cleaner asynchronous code chains
module.exports = pool.promise();