const express = require("express");
const router = express.Router({mergeParams: true});

const createDBConnection = require("../mysql");


router.get("/", (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const query = "SELECT * FROM pre_planning";
  
    db.query(
      query, (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          res.status(200).send(result);
        }
      }
    );
});

router.get("/:id", (req, res) => {
   const db = createDBConnection(process.env.MYSQL_DATABASE);

    // grab id from url
    const id = req.params.id;
    db.query(
      `SELECT * FROM pre_planning WHERE id = ?`, [id], (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          res.status(200).send(result);
        }
      }
    )
});  

module.exports = router;