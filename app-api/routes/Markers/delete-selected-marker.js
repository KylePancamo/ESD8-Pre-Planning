const express = require('express');
const router = express.Router();

const getPool = require("../mysql");

const {canDelete} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");


router.delete('/', verifyUserCredentials, canDelete, (req, res) => {
    const db = getPool(process.env.MYSQL_DATABASE);
    const query = "DELETE FROM markers WHERE marker_id = ?"
    const marker = req.body.marker;
    const data = [
      marker.marker_id
    ]
  
    db.query(
      query, data,
      (err, result) => {
        if (err) {
          logger.warn(`Error deleting marker ${req.body.marker_id}`, {
            error: `${err.message, err.stack}`
          });
          res.status(500).send({status: "error", message: "Error deleting marker"});
          return;
        }
        
        logger.info(`Marker ID ${marker.marker_id} successfully deleted`, {
          marker: marker
        });
        res.status(200).send({status: "success", message: "Marker deleted"});
      }
    )
});

module.exports = router;
  