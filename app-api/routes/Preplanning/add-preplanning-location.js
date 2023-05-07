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
      
      let data = [
        address.google_formatted_address,
        address.latitude,
        address.longitude,
        payload.occupancyName,
        payload.streetAddress,
        payload.city,
        payload.state,
        payload.zipCode,
        payload.country,
        payload.hazards,
        payload.hydrantAddress,
        payload.accessInformation,
        payload.electricMeterLoc,
        payload.breakerBoxLoc,
        payload.waterLoc,
        payload.gasShutoffLoc,
        payload.emergencyContact,
        payload.notes,
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
          `SELECT * FROM pre_planning WHERE google_formatted_address = ?`, [address.google_formatted_address], (err, result) => {
            if (err) {
              logger.warn('Error adding preplanning location', {
                error: `${err.message, err.stack}`,
              });
            } else {
              if (result.length > 0) {
                res.status(409).send({status: "error", message: 'Location already exists'});
              } else {
                let query = `INSERT INTO pre_planning (google_formatted_address, latitude, longitude, occupancyname, occupancyaddress, occupancycity, occupancystate, occupancyzip, occupancycountry, 
                                hazards, hydrant_address, access, electric_meter, breaker_box, water, gas_shutoff, emergency_contact_number, other_notes,
                                contactname) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                connection.query(
                  query, data, (err, result) => {
                    if (err) {
                      logger.warn('Error adding preplanning location', {
                        error: `${err.message, err.stack}`,
                      });
                      res.status(400).send({status: "error", message: "Error adding preplanning location", error: err.message});
                    } else {
                      // if payload data is '' then use empty array
                      const occupancyTypes = payload.occupancyType || [];
                      const constructionTypes = payload.constructionType || [];
                      const mutualAids = payload.mutualAid || [];
                      const locationId = result.insertId;
                      
                      console.log(occupancyTypes);
                      // map occupancyTypes in array to locationId. Example: 1: 2, 1:3, 1:4
                      const occupancyTypesData = occupancyTypes?.map(occupancyType => {
                        return [locationId, occupancyType];
                      });
                      const constructionTypesData = constructionTypes?.map(constructionType => {
                        return [locationId, constructionType];
                      });
                      const mutualAidsData = mutualAids?.map(mutualAid => {
                        return [locationId, mutualAid];
                      });
                      console.log(mutualAidsData);
                      let typesQuery = '';
                      let values = [];
                      if (occupancyTypesData.length > 0) {
                        typesQuery += `
                          INSERT INTO pre_planning_occupancy_types (pre_planning_id, occupancy_id) VALUES ?;
                          `;
                          values.push(occupancyTypesData);
                      }

                      if (constructionTypesData.length > 0) {
                        typesQuery += `
                          INSERT INTO pre_planning_construction_types (pre_planning_id, construction_type_id) VALUES ?;
                          `;
                          values.push(constructionTypesData);
                      }

                      if (mutualAidsData.length > 0) {
                        typesQuery += `
                          INSERT INTO pre_planning_mutual_aid (pre_planning_id, mutual_aid_id) VALUES ?;
                          `;
                          values.push(mutualAidsData);
                      }
                      
                      if (typesQuery === '') {
                        res.status(200).send({status: "success", message: "Preplanning location added"});
                        return;
                      }

                      connection.query(
                        typesQuery, values, (err, result) => {
                          if (err) {
                            console.error("Generated SQL Error", err.sql);
                            logger.warn('Error adding preplanning location', {
                              error: `${err.message, err.stack}`,
                            });
                          } else {
                            res.status(200).send({status: "success", message: "Preplanning location added", locationId: locationId});
                          }
                        }
                      )
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