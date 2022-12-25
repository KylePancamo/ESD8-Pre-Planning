const express = require('express');
const router = express.Router();

const db = require('../mysql');

router.post('/', (req, res) => {
    let address = req.body.address;
    
    if (typeof address !== 'string') {
      return res.status(400).send({message: 'Address must be a string'});
    }
    // splitup address with separator ','
    let addressArray = address.split(',');
  
    let occupancyaddress = addressArray[0].trim();
    console.log(occupancyaddress);
    let city = addressArray[1].trim();
    console.log(city);
    const query = `SELECT * FROM pre_planning WHERE occupancyaddress = ? AND occupancycity = ?`;
    const data = [
      occupancyaddress,
      city,
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