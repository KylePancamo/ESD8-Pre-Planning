const express = require('express');
const router = express.Router();

const createDBConnection = require("../mysql");


router.delete('/', (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const query = "DELETE FROM markers WHERE marker_id = ?"
    const data = [
      req.body.marker_id
    ]
  
    db.query(
      query, data,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send(result);
        }
      }
    )
});

module.exports = router;
  