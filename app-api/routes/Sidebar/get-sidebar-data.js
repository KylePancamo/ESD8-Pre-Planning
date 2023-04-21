const express = require('express');
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.post('/', verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);
    try {
      let googleFormattedAddress = req.body.address;
      
      if (typeof googleFormattedAddress !== 'string') {
        return res.status(400).send({message: 'Address must be a string'});
      }

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
                    WHERE pp.google_formatted_address = ?
                    GROUP BY pp.id`;
      const data = [
        googleFormattedAddress
      ]
    
      db.query(
        query, data, (err, result) => {
          if (err) {
            logger.warn(`Error getting preplanning location for address ${googleFormattedAddress}`, {
              error: `${err.message, err.stack}`,
            });
            res.status(400).send({status: 'error', message: 'Data was not able to be retrieved'});
          } else {
            result[0].construction_types = result[0].construction_types.split(',') || '';
            result[0].occupancy_types = result[0].occupancy_types.split(',') || '';
            result[0].mutual_aids = result[0].mutual_aids.split(',') || '';
            res.status(200).send({status: 'success', message: 'Data was retrieved', payload: result});
          }
        }
      );
    } catch (err) {
      logger.warn(`Error getting preplanning location for address ${googleFormattedAddress}`, {
        error: `${err.message, err.stack}`,
      });
      res.status(400).send({status: 'error', message: 'Data was not able to be retrieved'});
    }
});

module.exports = router;