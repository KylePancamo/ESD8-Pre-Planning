const express = require('express');
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');


router.post('/',verifyUserCredentials, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    let googleFormattedAddress = req.body.address;
    
    if (typeof googleFormattedAddress !== 'string') {
      return res.status(400).send({message: 'Address must be a string'});
    }

    const query = `SELECT * FROM pre_planning WHERE google_formatted_address = ?`;
    const data = [
      googleFormattedAddress
    ]
  
    db.query(
      query, data, (err, result) => {
        if (err) {
          console.log(err.message);
          res.status(400).send({status: 'error', message: 'Data was not able to be retrieved'});
        } else {
          res.status(200).send({status: 'success', message: 'Data was retrieved', payload: result});
        }
      }
    );
});

module.exports = router;