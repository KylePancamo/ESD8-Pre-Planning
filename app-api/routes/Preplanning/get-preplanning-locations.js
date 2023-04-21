const express = require("express");
const router = express.Router({mergeParams: true});

const getPool = require("../mysql");

const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.get("/", verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    const query = `SELECT pp.*, 
                  COALESCE(GROUP_CONCAT(DISTINCT ct.name), '') AS construction_types, 
                  COALESCE(GROUP_CONCAT(DISTINCT ot.name), '') AS occupancy_types, 
                  COALESCE(GROUP_CONCAT(DISTINCT ma.name), '') AS mutual_aids
              FROM pre_planning pp
              LEFT JOIN pre_planning_construction_types ppct ON pp.id = ppct.pre_planning_id
              LEFT JOIN construction_types ct ON ppct.construction_type_id = ct.id
              LEFT JOIN pre_planning_occupancy_types ppot ON pp.id = ppot.pre_planning_id
              LEFT JOIN occupancy_types ot ON ppot.occupancy_id = ot.id
              LEFT JOIN pre_planning_mutual_aid ppma ON pp.id = ppma.pre_planning_id
              LEFT JOIN mutual_aid ma ON ppma.mutual_aid_id = ma.id
              GROUP BY pp.id;
              `;
  
    db.query(
      query, (err, result) => {
        if (err) {
          logger.warn("Error getting preplanning locations", {
            error: `${err.message, err.stack}`,
          });
        } else {
          result = result.map((location) => {
            return {
              ...location,
              construction_types: (location.construction_types === '') ? '' : location.construction_types.split(","),
              occupancy_types: (location.occupancy_types === '') ? ''  : location.occupancy_types.split(","),
              mutual_aids: (location.mutual_aids === '') ? '' : location.mutual_aids.split(","),
            };
          })
          res.status(200).send({status: "success", message: "Preplanning locations retrieved", result});
        }
      }
    );
});

router.get("/:id", (req, res) => {
   const db = getPool("esd8_preplanning_db");

  const query = `SELECT pp.*, 
                COALESCE(GROUP_CONCAT(DISTINCT ct.name), '') AS construction_types, 
                COALESCE(GROUP_CONCAT(DISTINCT ot.name), '') AS occupancy_types, 
                COALESCE(GROUP_CONCAT(DISTINCT ma.name), '') AS mutual_aids
              FROM pre_planning pp
              LEFT JOIN pre_planning_construction_types ppct ON pp.id = ppct.pre_planning_id
              LEFT JOIN construction_types ct ON ppct.construction_type_id = ct.id
              LEFT JOIN pre_planning_occupancy_types ppot ON pp.id = ppot.pre_planning_id
              LEFT JOIN occupancy_types ot ON ppot.occupancy_id = ot.id
              LEFT JOIN pre_planning_mutual_aid ppma ON pp.id = ppma.pre_planning_id
              LEFT JOIN mutual_aid ma ON ppma.mutual_aid_id = ma.id
              WHERE pp.id = ?
              GROUP BY pp.id;
              `;

    // grab id from url
    const id = req.params.id;
    db.query(
      query, id, (err, result) => {
        if (err) {
          logger.warn("Error getting preplanning locations", {
            error: `${err.message, err.stack}`,
          });
        } else {
          result[0].construction_types = result[0].construction_types.split(',') || '';
          result[0].occupancy_types = result[0].occupancy_types.split(',') || '';
          result[0].mutual_aids = result[0].mutual_aids.split(',') || '';
          res.status(200).send({status: "success", message: "Preplanning locations retrieved", result});
        }
      }
    )
});  

module.exports = router;