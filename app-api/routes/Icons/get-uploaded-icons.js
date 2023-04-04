const express = require('express');
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");


router.get('/', verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_DATABASE);
    const query = 'SELECT * FROM icons';
  
    db.query(query, (err, result) => {
      if (err) {
        logger.warn('Error getting uploaded icons', {
          error: `${err.message, err.stack}`,
        });
        res.status(500).send({ status: 'error'});
      } else {
        res.status(200).send(result);
      }
    });
});

module.exports = router;