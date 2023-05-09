const express = require('express');
const router = express.Router();

const {canModify} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const getPool = require("../mysql");

const logger = require("../../logger");

router.post('/', verifyUserCredentials, canModify, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    let query = "UPDATE markers SET latitude = ?, longitude = ? WHERE marker_id = ?"

    let data = [
      Number(req.body.latitude),
      Number(req.body.longitude),
      req.body.marker_id
    ]
  
    db.query(
      query, data, (err, result) => {
        if (err) {
          logger.warn(`Error updating UPDATE query for marker ${req.body.marker_id} with latitude ${req.body.latitude} and longitude ${req.body.longitude} `, {
            error: `${err.message, err.stack}`,
            query: `${err.sql}`,
          });
          res.status(500).send({status: "error", message: "Error updating marker"});
          return;
        }
        console.log("success");
        res.status(200).send({status: "success", message: "Marker updated successfully"});
      }
    )
});

module.exports = router;