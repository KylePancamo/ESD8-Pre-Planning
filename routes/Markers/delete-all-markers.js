const express = require('express');
const router = express.Router();

const isAuthorized = require('../Auth/authorization');
const getUser = require('../Auth/getUser');


const createDBConnection = require("../mysql");


router.delete('/', getUser, isAuthorized, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const query = "TRUNCATE TABLE markers"
  
    db.query(
      query,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send(result);
        }
      }
    )
});

module.exports = router;