const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");


router.get("/", verifyUserCredentials, (req, res) => {
    const db = getPool("auth");

    const query = `SELECT * from roles;`

    db.query(query, (err, result) => {
        if (err) {
            logger.warn("Error getting roles", {
                error: `${err.message, err.stack}`
            })
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success', payload: result});
    })
});

module.exports = router;