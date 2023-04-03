// mysql.js
const mysql = require('mysql2');
const logger = require('../logger');

const createDBConnection = (database, multiStatement = false) => {
  try {
    const db = mysql.createConnection({
      user: process.env.MYSQL_USERNAME,
      host: process.env.MYSQL_HOST_NAME,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: database,
      multipleStatements: multiStatement
    });
    
    db.connect((err) => {
      if (err) {
        logger.error("Error connecting to MySQL database", {error: `${err.message, err.stack}`});
        throw err;
      }
    });

    return db;

  } catch (err) {
    logger.warn("Error creating MySQL connection", {error: `${err.message, err.stack}`})
    return null;
  }
  return null;
}

module.exports = createDBConnection;