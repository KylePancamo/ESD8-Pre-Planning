const express = require('express');
const router = express.Router();

const {isAuthorized} = require('../Auth/authorization');
const verifyUserCredentials = require('../Auth/verifyUserCredentials');


const createDBConnection = require("../mysql");


router.post('/', verifyUserCredentials, isAuthorized, (req, res) => {
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
          console.log(err.message)
        } else {
          if (file) {
            file.mv("./public/marker_images/" + file.name, (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
          res.status(200).send({status: "success", message: "Marker updated successfully"});
        }
      }
    )
});

module.exports = router;