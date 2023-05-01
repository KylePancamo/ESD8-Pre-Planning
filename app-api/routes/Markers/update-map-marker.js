const express = require('express');
const router = express.Router();

const {canModify} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const fs = require('fs');

const getPool = require("../mysql");

const logger = require("../../logger");

router.post('/', verifyUserCredentials, canModify, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    let query = "UPDATE markers SET marker_name = ?, icon_id = ?, latitude = ?, longitude = ?, image = ? WHERE marker_id = ?"
    let file = req.files?.file;
    const oldImage = req.body.old_image_name;
    console.log(oldImage);
    const uniqueMarkerName = req.body.image_name;
    let data = [
      req.body.marker_name,
      req.body.icon_id,
      Number(req.body.latitude),
      Number(req.body.longitude),
      req.body.image_name === "null" ? null : uniqueMarkerName ,
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
              if (oldImage !== "null" && oldImage !== uniqueMarkerName) {
                // delete old image
                fs.unlinkSync("../app-ui/public/marker_images/" + oldImage);
              }
              // upload new image
              if (!fs.existsSync("../app-ui/public/marker_images/" + uniqueMarkerName)) {
                file.mv("../app-ui/public/marker_images/" + uniqueMarkerName, (err) => {
                  if (err) {
                    logger.warn(`Error uploading marker image ${uniqueMarkerName}`, {
                      error: `${err.message, err.stack}`
                    });
                  }
                });
              }
            } catch (err) {
              logger.warn(`Error uploading marker image ${uniqueMarkerName}`, {
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