const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const user = req.body;

    // grab user who sent the request
    const requestUser = req.user;

    if (requestUser.username === user.username || requestUser.id === user.user_id) {
        res.send({ status: 'error', message: 'You cannot change your own role' });
        return;
    }

    if (user.role_id === 0) {
        res.send({ status: 'error', message: 'Please select an appropriate role' });
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
            res.send({ status: 'error', message: 'Error updating role.' });
            return;
        }

        res.send({status: 'success'});
    })

});

module.exports = router;