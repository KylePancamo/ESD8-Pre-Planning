const express = require("express");
const router = express.Router();

const getPool = require("../mysql");

const {canModify} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, canModify, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    try {
      const payload = req.body.payload;
      console.log(payload);
      const google_formatted_address = req.body.googleAddress;
      const id = req.body.id;

      const query = `UPDATE pre_planning SET 
                      google_formatted_address = ?, occupancyname = ?, occupancyaddress = ?, occupancycity = ?, occupancystate = ?, occupancyzip = ?,
                      occupancycountry = ?, hazards = ?, hydrant_address = ?, 
                      hydrant_distance = ?, access = ?, electric_meter = ?, breaker_box = ?, water = ?, 
                      gas_shutoff = ?, emergency_contact_number = ?, other_notes = ?,
                      contactname = ? WHERE id = ?`;
    
      const data = [
        google_formatted_address,
        payload.occupancyName,
        payload.streetAddress,
        payload.city,
        payload.state,
        payload.zipCode,
        payload.country,
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
        payload.contactName,
        id
      ];
    
      db.query(query, data, (err, result) => {
        if (err) {
          logger.warn('Error updating preplanning location', {
            error: `${err.message, err.stack}`,
          });
          res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
        } else {
          res.status(200).send({status: "success", message: "Preplanning location updated"});
        }
      })
    } catch (err) {
      logger.warn('Error updating preplanning location', {
        error: `${err.message, err.stack}`,
      });
      res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
    }
});

module.exports = router;