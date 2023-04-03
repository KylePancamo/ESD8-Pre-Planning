const express = require('express');
const router = express.Router();

const {canModify} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const createDBConnection = require("../mysql");

const logger = require("../../logger");

router.post('/', verifyUserCredentials, canModify, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    let query = "UPDATE markers SET marker_name = ?, icon_id = ?, latitude = ?, longitude = ?, image = ? WHERE marker_id = ?"
    let file = req.files?.file;
    let data = [
      req.body.marker_name,
      req.body.icon_id,
      Number(req.body.latitude),
      Number(req.body.longitude),
      req.body.image_name === "null" ? null : req.body.image_name,
      req.body.marker_id,
    ]
  
    db.query(
      query, data, (err, result) => {
        if (err) {
          logger.warn(`Error updating marker ${req.body.marker_id}`, {
            error: `${err.message, err.stack}`
          });
          res.status(500).send({status: "error", message: "Error updating marker"});
        } else {
          if (file) {
            try {
              file.mv("./public/marker_images/" + file.name, (err) => {
                if (err) {
                  logger.warn(`Error uploading marker image ${file.name}`, {
                    error: `${err.message, err.stack}`
                  });
                }
              });
            } catch (err) {
              logger.warn(`Error uploading marker image ${file.name}`, {
                error: `${err.message, err.stack}`
              });
            }
          }
          res.status(200).send({status: "success", message: "Marker updated successfully"});
        }
      }
    )
});

module.exports = router;