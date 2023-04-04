const express = require('express');
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.get('/', verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    const query = `SELECT
                  markers.marker_id,
                  markers.marker_name,
                  markers.latitude,
                  markers.longitude,
                  markers.icon_id,
                  markers.image,
                  icons.file_name
                FROM markers
                LEFT JOIN icons
                  ON markers.icon_id = icons.icon_id`;
    
    db.query(
      query, 
      (err, result) => {
        if (err) {
          logger.warn('Error fetching markers', {
            error: `${err.message, err.stack}`
          });
          res.status(500).send({status: 'error', message: 'Error fetching markers'});
          return;
        }

        res.status(200).send({status: 'success', message: 'Successfully fetched markers', payload: result});
      }
    )
});

module.exports = router;