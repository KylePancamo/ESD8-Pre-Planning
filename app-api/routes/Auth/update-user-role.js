const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = createDBConnection("auth");

    const user = req.body;

    if (user.role_id === 0) {
        res.send({ status: 'error', err: 'Please select an appropriate role' });
        return;
    }

    const query = `
        INSERT INTO user_roles (user_id, role_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE role_id = ?;
    `
    const data = [user.user_id, user.role_id, user.role_id];

    db.query(query, data, (err, result) => {
        if (err) {
            logger.warn(`Error updating role for user ${user.user_id}`, {
                error: `${err.message, err.stack}`
            });
            res.send({ status: 'error', err: 'Error updating role.' });
            return;
        }

        res.send({status: 'success'});
    })

});

module.exports = router;