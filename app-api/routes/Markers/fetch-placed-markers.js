const express = require('express');
const router = express.Router();

const createDBConnection = require("../mysql");

router.get('/', (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
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
          console.log(err.message)
          res.status(500).send({status: 'error', message: 'An unexpected error occurred'})
        } else {
          console.log(result);
          res.status(200).send({status: 'success', message: 'Successfully fetched markers', payload: result});
        }
      }
    )
});

module.exports = router;