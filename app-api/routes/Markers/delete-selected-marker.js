const express = require('express');
const router = express.Router();

const getPool = require("../mysql");

const {canDelete} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const fs = require('fs');

const logger = require("../../logger");


router.delete('/', verifyUserCredentials, canDelete, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    try {
      const query = "DELETE FROM markers WHERE marker_id = ?"
      const marker = req.body.marker;
      const markerImageName = marker.image;
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

          if (fs.existsSync("../app-ui/public/marker_images/" + markerImageName)) {
            fs.unlinkSync("../app-ui/public/marker_images/" + markerImageName);
          }
          logger.info(`Marker ID ${marker.marker_id} successfully deleted`, {
            marker: marker
          });
          res.status(200).send({status: "success", message: "Marker deleted"});
        }
      )
    } catch (err) {
      logger.warn(`Error deleting marker ${req.body.marker_id}`, {
        error: `${err.message, err.stack}`
      });
      res.status(500).send({status: "error", message: "Error deleting marker"});
    }
});

module.exports = router;
  