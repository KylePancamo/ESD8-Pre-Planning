const express = require('express');
const router = express.Router();

const db = require('../mysql');

router.post('/',  (req, res) => {
    let query = "UPDATE markers SET marker_name = ?, icon_id = ?, latitude = ?, longitude = ?, image = ? WHERE marker_id = ?"
    let file = req.files?.file;
    let data = [
      req.body.marker_name,
      req.body.icon_id,
      Number(req.body.latitude),
      Number(req.body.longitude),
      req.body.image_name ? req.body.image_name : null,
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
          res.status(200).send(result);
        }
      }
    )
});

module.exports = router;