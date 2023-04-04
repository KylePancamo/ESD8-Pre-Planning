const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");

router.get("/", verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const user = req.user;

    const query = `
        SELECT a.id AS user_id, a.username, COALESCE(r.id, 0) AS role_id, COALESCE(r.name, 'No Role Assigned') AS name
        FROM accounts a
        LEFT JOIN user_roles ur ON a.id = ur.user_id
        LEFT JOIN roles r ON r.id = ur.role_id
        WHERE a.username != 'admin'
        GROUP BY a.id, a.username, r.id, r.name;
    `

    db.query(query, user.username, (err, result) => {
        if (err) {
            logger.warn("Error getting user roles", {
                error: `${err.message, err.stack}`
            })
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success', payload: result});
    })

});

module.exports = router;