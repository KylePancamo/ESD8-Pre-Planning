const express = require('express');
const router = express.Router();

const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {canDelete} = require('../middleware/authorization');


const createDBConnection = require("../mysql");


router.delete('/', verifyUserCredentials, canDelete, (req, res) => {
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