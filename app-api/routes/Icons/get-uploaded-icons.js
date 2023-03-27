const express = require('express');
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');


router.get('/', verifyUserCredentials, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const query = 'SELECT * FROM icons';
  
    db.query(query, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.status(200).send(result);
      }
    });
});

module.exports = router;