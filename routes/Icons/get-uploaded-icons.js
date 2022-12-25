const express = require('express');
const router = express.Router();

const db = require('../mysql');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM icons';
  
    db.query(query, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.status(200).send(result);
      }
    });
});

module.exports = router;