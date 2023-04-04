const express = require('express');
const router = express.Router();
const fs = require('fs');

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.get('/', verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    let fileName = req.query.fileName;

    if (fs.existsSync(`../app-ui/public/icon_images/${fileName}`)) {
      // if file exists on the system, check to see if it exists in the database.
      // if it doesn't exist in the database, add it to the database,
      // else do nothing
      db.getConnection((err, connection) => {
        if (err) {
          logger.warn('Error getting connection', {
            error: `${err.message, err.stack}`,
          });
          res.status(500).send({status: "error", message: "Error getting connection"});

          return;
        }

        connection.query(
          `SELECT * FROM icons WHERE file_name = ?`, [fileName], (err, result) => {
            if (err) {
              logger.warn(`Error checking if file exists in database`, {
                error: `${err.message, err.stack}`
              });
              res.status(500).send({status: "error", message: "Error checking if file exists in database"});

              return;
            }
            if (result.length === 0) {
              // if the file doesn't exist in the database but exists on the system
              // add it to the database
              connection.query(
                `INSERT INTO icons (file_name, icon_name) VALUES (?, ?)`, [fileName, 'default'], (err, result) => {
                  if (err) {
                    logger.warn(`Error adding file to database`, {
                      error: `${err.message, err.stack}`
                    });
                    res.status(500).send({status: "error", message: "Error adding file to database"});

                    return;
                  }

                  const insertId = result.insertId;
                  console.log("File added to database. Updating markers...");
                  // query markers and update icon_id to the insertId
                  connection.query(
                    `UPDATE markers SET icon_id = ? WHERE icon_id = ? OR icon_id = ?`, [insertId, 0, -1], (err, result) => {
                      if (err) {
                        logger.warn(`Error updating markers`, {
                          error: `${err.message, err.stack}`
                        });
                        res.status(500).send({status: "error", message: "Error updating markers"});
                        return;

                      }
                      res.status(200).send({status: "success", message: "File exists"});

                      connection.release();
                    });
                })
            } else {
              res.status(200).send({status: "success", message: "File exists"});
            }
        }).finally(() => {
          if (connection) { 
            connection.release();
          }
        })
      })
    } else {
      res.status(404).send({status: "error", message: "File not found"});
    }
});

module.exports = router;