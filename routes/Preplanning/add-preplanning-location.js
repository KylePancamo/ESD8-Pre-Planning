const express = require("express");
const router = express.Router();

const db = require("../mysql");

router.post("/", (req, res) => {
    const payload = req.body.payload.data;
    const googleFormattedAddress = req.body.payload.formattedAddress.trim();
    const query = `INSERT INTO pre_planning (google_formatted_address, occupancyname, mut_aid_helotesfd, mut_aid_d7fr, mut_aid_leonspringsvfd, mut_aid_bc2fd, occupancyaddress, occupancycity, occupancystate, occupancyzip, occupancycountry, constructiontype, 
                                             hazards, hydrant_address, hydrant_distance, access, electric_meter, breaker_box, water, gas_shutoff, emergency_contact_number, other_notes,
                                             occupancytype, contactname) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const data = [
      googleFormattedAddress,
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
  
    db.query(
      `SELECT * FROM pre_planning WHERE google_formatted_address = ?`, [googleFormattedAddress], (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          if (result.length > 0) {
            res.status(409).send({status: "error", message: 'Location already exists'});
          } else {
            db.query(
              query, data, (err, result) => {
                if (err) {
                  res.status(400).send({status: "error", message: "Error adding preplanning location", error: err.message});
                } else {
                  res.status(200).send({status: "success", message: "Preplanning location added"});
                }
              }
            )
          }
        }
      }
    )
});

module.exports = router;