const express = require('express');
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {canModify} = require('../middleware/authorization');

const logger = require("../../logger");

router.post('/', verifyUserCredentials, canModify, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    try {
      const fileExists = req.body.payload.fileExists;
      const fileName = req.body.payload.fileName;
    } catch (err) {
      logger.warn('Error inserting marker', {
        error: `${err.message, err.stack}`,
      });
      res.status(500).send({ status: 'error'});
    }

    db.query(
      "SELECT * FROM icons WHERE file_name = ?", [fileName], (err, result) => {

      if (err) {
        logger.warn('Error inserting marker', {
          error: `${err.message, err.stack}`,
        });
        res.status(500).send({ status: 'error'});
      }
  
      let iconId;
      if (result.length > 0) {
        iconId = result[0].icon_id;
      } else {
        iconId = fileExists ? 0 : -1;
      }
      const data = [
        req.body.payload.position.lat.toFixed(8),
        req.body.payload.position.lng.toFixed(8),
        iconId,
      ]
      const query = "INSERT INTO markers(marker_name, latitude, longitude, icon_id) VALUES ('Enter a new marker name', ?, ?, ?)"
      db.query(
        query, data, (err, result) => {
          if (err) {
            console.log(err.message)
          } else {
            const payload = {
              marker_id: result.insertId,
              marker_name: "Enter a new marker name",
              latitude: req.body.payload.position.lat.toFixed(8),
              longitude: req.body.payload.position.lng.toFixed(8),
              icon_id: iconId,
              file_name: "edit_location_alt_FILL0_wght400_GRAD0_opsz48.png",
            }
            result.payload = payload;
            res.status(200).send({status: 'success', message: 'Successfully inserted marker', payload})
          }
        }
      )
    });
});

module.exports = router;