const express = require('express');
const router = express.Router();

const {isAuthorized} = require('../Auth/authorization');
const getUser = require('../Auth/getUser');


const createDBConnection = require("../mysql");


router.delete('/', getUser, isAuthorized, (req, res) => {
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