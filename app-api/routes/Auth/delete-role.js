const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');
const { getRequestIP } = require('../../utils');

const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = createDBConnection("auth", true);
    const IP = getRequestIP(req);

    const roleId = req.body.role.id;

    if (roleId === 1) {
        logger.warn(`IP address ${IP} tried to perform a suspicious action in file ${__filename}`);
        res.send({ status: 'error'});
        return;
    }

    const query = `
            DELETE FROM user_roles WHERE role_id = ?;
            DELETE FROM role_permissions WHERE role_id = ?;
            DELETE FROM roles WHERE id = ?;
        `;

    const data = [roleId, roleId, roleId];

    db.query(query, data, (err, result) => {
        if (err) {
            logger.warn(`Error deleting role ${roleId}`, {
                error: `${err.message, err.stack}`
            })
            res.send({ status: 'error', err: err });
            return;
        }
        logger.info(`Role ${roleId} deleted successfully`);
        res.send({status: 'success'});
    })
});

module.exports = router;