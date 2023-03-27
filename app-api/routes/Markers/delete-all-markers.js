const express = require('express');
const router = express.Router();

const {isAuthorized} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');


const createDBConnection = require("../mysql");


router.delete('/', verifyUserCredentials, isAuthorized, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const query = "TRUNCATE TABLE markers"
  
    db.query(
      query,
      (err, result) => {
        if (err) {
          res.status(500).send({status: "error", message: "Error deleting markers"});
        } else {
          res.status(200).send({status: "success", message: "All markers deleted"});
        }
      }
    )
});

module.exports = router;