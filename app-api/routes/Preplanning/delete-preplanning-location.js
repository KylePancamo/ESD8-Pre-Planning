const express = require("express");
const router = express.Router();

const getPool = require("../mysql");

const {canDelete} = require('../middleware/authorization');
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, canDelete, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);

    try {
        const locationId = req.body.id;
        const query = `
            DELETE FROM pre_planning_construction_types WHERE pre_planning_id = ?;
            DELETE FROM pre_planning_occupancy_types WHERE pre_planning_id = ?;
            DELETE FROM pre_planning_mutual_aid WHERE pre_planning_id = ?;
            DELETE FROM pre_planning WHERE id = ?;
        `;

        const data = [locationId, locationId, locationId, locationId];
        
        db.query(query, data, (err, result) => {
            if (err) {
                logger.warn(`Error querying preplanning location`, {error: `${err.message, err.stack}`})
                res.status(500).send({status: "error", error: "Error deleting preplanning location"});
                return;
            }
            res.status(200).send({status: "success", message: "Preplanning location deleted"});
        });
    } catch (err) {
        logger.warn(`Encountered some error with route ${__filename}`, {error: `${err.message, err.stack}`})
        res.status(500).send({status: "error", error: "Error deleting preplanning location"});
    }
});

module.exports = router;