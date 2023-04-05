const express = require("express");
const router = express.Router();

const getPool = require("../mysql");

const {canModify} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, canModify, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    try {
      const payload = req.body.payload.data;
      const address = req.body.payload.address;
      const query = `INSERT INTO pre_planning (google_formatted_address, latitude, longitude, occupancyname, mut_aid_helotesfd, mut_aid_d7fr, mut_aid_leonspringsvfd, mut_aid_bc2fd, occupancyaddress, occupancycity, occupancystate, occupancyzip, occupancycountry, constructiontype, 
                                              hazards, hydrant_address, hydrant_distance, access, electric_meter, breaker_box, water, gas_shutoff, emergency_contact_number, other_notes,
                                              occupancytype, contactname) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const data = [
        address.location,
        address.latitude,
        address.longitude,
        payload.occupancyName,
        parseInt(payload.mutual_aid1),
        parseInt(payload.mutual_aid2),
        parseInt(payload.mutual_aid3),
        parseInt(payload.mutual_aid4),
        payload.streetAddress,
        payload.city,
        payload.state,
        payload.zipCode,
        payload.country,
        parseInt(payload.constructionType),
        payload.hazards,
        payload.hydrantAddress,
        parseInt(payload.hydrantDistance),
        payload.accessInformation,
        payload.electricMeterLoc,
        payload.breakerBoxLoc,
        payload.waterLoc,
        payload.gasShutoffLoc,
        payload.emergencyContact,
        payload.notes,
        payload.occupancyType,
        payload.contactName
      ];
    
    db.getConnection((err, connection) => {
      if (err) {
        logger.warn("Error adding preplanning location", {
          error: `${err.message, err.stack}`,
        });
        res.status(500).send({ status: "error" });
        return;
      }
      try {
        connection.query(
          `SELECT * FROM pre_planning WHERE google_formatted_address = ?`, [address.location], (err, result) => {
            if (err) {
              logger.warn('Error adding preplanning location', {
                error: `${err.message, err.stack}`,
              });
            } else {
              if (result.length > 0) {
                res.status(409).send({status: "error", message: 'Location already exists'});
              } else {
                connection.query(
                  query, data, (err, result) => {
                    if (err) {
                      logger.warn('Error adding preplanning location', {
                        error: `${err.message, err.stack}`,
                      });
                      res.status(400).send({status: "error", message: "Error adding preplanning location", error: err.message});
                    } else {
                      res.status(200).send({status: "success", message: "Preplanning location added"});
                    }
                  }
                )
              }
            }
        });
      } catch (err) {
        logger.warn('Error adding preplanning location', {
          error: `${err.message, err.stack}`,
        });
        res.status(500).send({ status: 'error'});
      } finally {
        connection.release();
      }
    });
  } catch (err) {
    logger.warn('Error adding preplanning location', {
      error: `${err.message, err.stack}`,
    });
    res.status(500).send({ status: 'error'});
  }
});

module.exports = router;