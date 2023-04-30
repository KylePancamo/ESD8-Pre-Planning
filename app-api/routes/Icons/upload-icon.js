const express = require('express');
const router = express.Router();
var fs = require('fs');

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");

router.post('/', verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    let file = req.files.file;
    let iconName = req.body.iconName;
    try {
      if (file.mimetype !== 'image/png') {
        res.status(400).send({message: 'File must be a png image'});
        return;
      }
    
      if (fs.existsSync('./icon_images/' + file.name)) {
        res.status(400).send({message: 'File already exists'});
    
        return;
      }
    } catch (err) {
      logger.error('Error uploading file', {
        error: `${err.message, err.stack}`,
      });

    }
  
    let filename = file.name;
    const data = [
      filename,
      iconName,
    ]
    const query = 'INSERT INTO icons (file_name, icon_name) VALUES (?, ?)';
  
    db.query(query, data, (err, result) => {
      if (err) {
        logger.warn('Error uploading file', {
          error: `${err.message, err.stack}`,
        });
        res.status(400).send({message: 'Error uploading file'});
        return;
      }

      try {
        file.mv('../app-ui/public/icon_images/' + filename, (err) => {
          if (err) {
            logger.warn('Error uploading file', {
              error: `${err.message, err.stack}`,
            });
          } else {
            const payload = {
              icon_id: result.insertId,
              file_name: filename,
              icon_name: iconName,
            }
            res.status(200).send({message: 'File uploaded', payload: payload});
          }
        });
      } catch (err) {
        logger.error('Error uploading file', {
          error: `${err.message, err.stack}`,
        });
      }
    });
});

module.exports = router;