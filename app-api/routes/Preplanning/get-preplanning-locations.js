const express = require("express");
const router = express.Router({mergeParams: true});

const createDBConnection = require("../mysql");

const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.get("/", verifyUserCredentials, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const query = "SELECT * FROM pre_planning";
  
    db.query(
      query, (err, result) => {
        if (err) {
          logger.warn("Error getting preplanning locations", {
            error: `${err.message, err.stack}`,
          });
        } else {
          res.status(200).send({status: "success", message: "Preplanning locations retrieved", result});
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
          logger.warn("Error getting preplanning locations", {
            error: `${err.message, err.stack}`,
          });
        } else {
          res.status(200).send({status: "success", message: "Preplanning locations retrieved", result});
        }
      }
    )
});  

module.exports = router;