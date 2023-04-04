const express = require('express');
const router = express.Router();

const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {canDelete} = require('../middleware/authorization');
const logger = require("../../logger");

const getPool = require("../mysql");


router.delete('/', verifyUserCredentials, canDelete, (req, res) => {
    const db = getPool("esd8_preplanning_db");
    const query = "TRUNCATE TABLE markers"
  
    db.query(
      query,
      (err, result) => {
        if (err) {
          logger.warn("Error deleting markers", {
            error: `${err.message, err.stack}`,
          });
          res.status(500).send({status: "error", message: "Error deleting markers"});
          return;

        }
        logger.warn("All markers deleted", {
          error: `${err.message, err.stack}`,
        });
        
        res.status(200).send({status: "success", message: "All markers deleted"});
      }
    )
});

module.exports = router;