const express = require("express");
const router = express.Router();

const getPool = require("../mysql");

const {canModify} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, canModify, (req, res) => {
    const db = getPool("getPool");
    try {
      const payload = req.body.payload;
      const google_formatted_address = req.body.googleAddress;
      const id = req.body.id;

      const query = `UPDATE pre_planning SET 
                      google_formatted_address = ?, occupancyname = ?, mut_aid_helotesfd = ?, mut_aid_d7fr = ?, mut_aid_leonspringsvfd = ?, 
                      mut_aid_bc2fd = ?, occupancyaddress = ?, occupancycity = ?, occupancystate = ?, occupancyzip = ?,
                      occupancycountry = ?, constructiontype = ?, hazards = ?, hydrant_address = ?, 
                      hydrant_distance = ?, access = ?, electric_meter = ?, breaker_box = ?, water = ?, 
                      gas_shutoff = ?, emergency_contact_number = ?, other_notes = ?, occupancytype = ?, 
                      contactname = ? WHERE id = ?`;
    
      const data = [
        google_formatted_address,
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