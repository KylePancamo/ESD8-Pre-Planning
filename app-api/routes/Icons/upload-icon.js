const express = require('express');
const router = express.Router();
var fs = require('fs');

const createDBConnection = require("../mysql");

router.post('/', (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    let file = req.files.file;
    let iconName = req.body.iconName;
    if (file.mimetype !== 'image/png') {
      res.status(400).send({message: 'File must be a png image'});
  
      return;
    }
  
    if (fs.existsSync('./public/icon_images/' + file.name)) {
      res.status(400).send({message: 'File already exists'});
  
      return;
    }
  
    let filename = file.name;
    const data = [
      filename,
      iconName,
    ]
    const query = 'INSERT INTO icons (file_name, icon_name) VALUES (?, ?)';
  
    db.query(query, data, (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(400).send({message: 'Error uploading file'});
      } else {
        file.mv('./public/icon_images/' + filename, (err) => {
          if (err) {
            console.log(err);
          } else {
            const payload = {
              icon_id: result.insertId,
              file_name: filename,
              icon_name: iconName,
            }
            res.status(200).send({message: 'File uploaded', payload: payload});
          }
        })
      }
    });
});

module.exports = router;