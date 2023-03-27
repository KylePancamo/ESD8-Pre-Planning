const express = require('express');
const router = express.Router();

const createDBConnection = require("../mysql");

const {canDelete} = require('../Auth/authorization');
const verifyUserCredentials = require('../Auth/verifyUserCredentials');


router.delete('/', verifyUserCredentials, canDelete, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    console.log(req.body);
    const query = "DELETE FROM markers WHERE marker_id = ?"
    const data = [
      req.body.marker_id
    ]
  
    db.query(
      query, data,
      (err, result) => {
        if (err) {
          res.status(500).send({status: "error", message: "Error deleting marker"});
        } else {
          res.status(200).send({status: "success", message: "Marker deleted"});
        }
      }
    )
});

module.exports = router;
  