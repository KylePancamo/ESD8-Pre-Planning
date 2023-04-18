const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const user = req.body;
    const user_id = user.user_id;

    if (user.username === process.env.ADMIN_USERNAME) {
        logger.warn(`User ${user.username} tried to delete perform a suspicious action in file ${__filename}`);
        res.send({status: 'error'});
        return;
    }

    const query = `
            DELETE FROM user_roles WHERE user_id = ?;
            DELETE FROM accounts WHERE id = ?;
        `;

    db.query(query, [user_id, user_id], (err, result) => {
        if (err) {
            logger.warn(`Error deleting user ${user_id}`, {
                error: `${err.message, err.stack}`
            })
            res.send({ status: 'error', err: err });
            return;
        }

        logger.info(`User ${user.username} with ID ${user_id} was deleted successfully`);
        res.send({status: 'success'});
    })
});

module.exports = router;