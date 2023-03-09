// mysql.js
const mysql = require('mysql2');

const createDBConnection = (database) => {
  const db = mysql.createConnection({
    user: process.env.MYSQL_USERNAME,
    host: process.env.MYSQL_HOST_NAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: database,
  });

  db.connect((err) => {
    if (err) {
        console.log("\x1b[41m", "MySQL Connection Error:")
        console.log(process.env.MYSQL_DATABASE)
        throw err;
    }
  });
  
  return db;
}

module.exports = createDBConnection;