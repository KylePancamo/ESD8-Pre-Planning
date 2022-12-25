const express = require("express");
const router = express.Router();

const db = require("../mysql");

router.get("/", (req, res) => {
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