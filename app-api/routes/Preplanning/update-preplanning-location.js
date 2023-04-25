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

      let query;
  
      db.getConnection((err, connection) => {
        if (err) {
          logger.warn("Error updating preplanning location", {
            error: `${err.message, err.stack}`,
          });
          res.status(500).send({ status: "error" });
          return;
        }

        query = `SELECT * FROM pre_planning_construction_types WHERE pre_planning_id = ?;
                  SELECT * FROM pre_planning_mutual_aid WHERE pre_planning_id = ?;
                  SELECT * FROM pre_planning_occupancy_types WHERE pre_planning_id = ?;`;
        let data = [id, id, id];
        
        connection.query(query, data,(err, result) => {
          if (err) {
            logger.warn('Error updating preplanning location', {
              error: `${err.message, err.stack}`,
            });
            res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
            return;
          }

          const constructionTypeIds = result[0].map(constructionType => parseInt(constructionType.construction_type_id));
          const mutualAidIds = result[1].map(mutualAid => parseInt(mutualAid.mutual_aid_id));
          const occupancyTypeIds = result[2].map(occupancyType => parseInt(occupancyType.occupancy_id));
          
          const uncheckedConstructionTypes = constructionTypeIds.filter(id => !payload.constructionType.includes(id.toString()));
          const uncheckedMutualAids = mutualAidIds.filter(id => !payload.mutualAid.includes(id.toString()));
          const uncheckedOccupancyTypes = occupancyTypeIds.filter(id => !payload.occupancyType.includes(id.toString()));

          let newlyAddedConstructionTypes = payload.constructionType.filter(id => !constructionTypeIds.includes(parseInt(id)));
          let newlyAddedMutualAids = payload.mutualAid.filter(id => !mutualAidIds.includes(parseInt(id)));
          let newlyAddedOccupancyTypes = payload.occupancyType.filter(id => !occupancyTypeIds.includes(parseInt(id)));

          newlyAddedConstructionTypes = newlyAddedConstructionTypes.map(constructionType => [id, parseInt(constructionType)]);
          newlyAddedMutualAids = newlyAddedMutualAids.map(mutualAid => [id, parseInt(mutualAid)]);
          newlyAddedOccupancyTypes = newlyAddedOccupancyTypes.map(occupancyType => [id, parseInt(occupancyType)]);
          

          query = `
            DELETE from pre_planning_construction_types
            WHERE construction_type_id in (?);

            DELETE from pre_planning_mutual_aid
            WHERE mutual_aid_id in (?);

            DELETE from pre_planning_occupancy_types
            WHERE occupancy_id in (?);
          `;

          const values = [
            uncheckedConstructionTypes.length > 0 ? uncheckedConstructionTypes : "",
            uncheckedMutualAids.length > 0 ? uncheckedMutualAids : "",
            uncheckedOccupancyTypes.length > 0 ? uncheckedOccupancyTypes : "",
          ];

          if (newlyAddedConstructionTypes.length > 0) {
            query += `
                INSERT INTO pre_planning_construction_types (pre_planning_id, construction_type_id)
                VALUES ?;
              `;
            values.push(newlyAddedConstructionTypes);
          }

          if (newlyAddedMutualAids.length > 0) {
            query += `
                INSERT INTO pre_planning_mutual_aid (pre_planning_id, mutual_aid_id)
                VALUES ?;
              `;
            values.push(newlyAddedMutualAids);
          }

          if (newlyAddedOccupancyTypes.length > 0) {
            query += `
                INSERT INTO pre_planning_occupancy_types (pre_planning_id, occupancy_id)
                VALUES ?;
              `;
            values.push(newlyAddedOccupancyTypes);
          }

          connection.query(query, values, (err, result) => {
            if (err) {
              
              console.error("Generated SQL Error", err.sql);
              logger.warn('Error updating preplanning location', {
                error: `${err.message, err.stack}`,
              });
              res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
              return;
            }

          })

          data = [
            google_formatted_address,
            payload.occupancyName,
            payload.occupancyAddress,
            payload.occupancyCity,
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

          query = `UPDATE pre_planning SET 
                      google_formatted_address = ?, occupancyname = ?, occupancyaddress = ?, occupancycity = ?, occupancystate = ?, occupancyzip = ?,
                      occupancycountry = ?, hazards = ?, hydrant_address = ?, 
                      hydrant_distance = ?, access = ?, electric_meter = ?, breaker_box = ?, water = ?, 
                      gas_shutoff = ?, emergency_contact_number = ?, other_notes = ?,
                      contactname = ? WHERE id = ?`;
          connection.query(query, data, (err, result) => {
            if (err) {
              logger.warn('Error updating preplanning location', {
                error: `${err.message, err.stack}`,
              });
              res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
            } else {
              const occupancyTypes = payload.occupancyTypes;
              const constructionTypes = payload.constructionTypes;
              const mutualAids = payload.mutualAids;
  
              // grab data from pre_planning_occupancy_types, pre_planning_construction_types, and pre_planning_mutual_aids tables, the compare what's in the payload to what's in the pre_planning tables
  
              res.status(200).send({status: "success", message: "Preplanning location updated"});
            }
          })
        })
      })
    } catch (err) {
      logger.warn('Error updating preplanning location', {
        error: `${err.message, err.stack}`,
      });
      res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
    }
});

module.exports = router;