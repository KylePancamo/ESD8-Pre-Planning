const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const userToDelete = req.body;
    const deleteUserId = userToDelete.user_id;

    // grab user who sent the request
    const requestUser = req.user;

    if (requestUser.userName === userToDelete.username || requestUser.id === deleteUserId) {
        logger.warn(`User ${requestUser.username} tried to delete themselves in file`);
        res.status(403).send({status: 'error', message: "You cannot delete yourself."});
        return;
    }

    if (requestUser.username !== process.env.ADMIN_USERNAME) {
        logger.warn(`User ${requestUser.username} tried to delete perform a suspicious action in file ${__filename}`);
        res.status(403).send({status: 'error', message: "You are not authorized to perform this action."});
        return;
    }

    const query = `
            DELETE FROM user_roles WHERE user_id = ?;
            DELETE FROM accounts WHERE id = ?;
        `;

    db.query(query, [deleteUserId, deleteUserId], (err, result) => {
        if (err) {
            logger.warn(`Error deleting user ${deleteUserId}`, {
                error: `${err.message, err.stack}`
            })
            res.send({ status: 'error', err: err });
            return;
        }

        logger.info(`User ${userToDelete.username} with ID ${deleteUserId} was deleted successfully`);
        res.send({status: 'success'});
    })
});

module.exports = router;