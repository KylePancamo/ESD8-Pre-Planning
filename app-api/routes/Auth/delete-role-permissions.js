const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');
const { getRequestIP } = require('../../utils');
const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = createDBConnection("auth");
    const IP = getRequestIP(req);

    const roleId = req.body.role.id;
    if (roleId === 1) {
        logger.warn(`IP address of ${IP} tried to perform a suspicious action in file ${__filename}`);
        res.send({ status: 'error'});
        return;
    }
    const removedPermissions = req.body.removedPermissions;
    const removedPermissionsString = removedPermissions.toString(16);

    const data = [removedPermissionsString];

    const permissionIdQuery = `SELECT p.id, p.name
            FROM permissions p
            WHERE (UNHEX(?) & p.security_hex) = p.security_hex;`;

    db.query(permissionIdQuery, data, (err, result) => {
        if (err) {
            logger.warn(`Error getting permission ids for role ${roleId} with permissions ${removedPermissionsString}`, {
                error: err
            })
            res.send({ status: 'error', err: err });
            return;
        }
        const values = result.map(result => [result.id]);
        const data = [roleId, [values]];
        const deleteQuery = `DELETE FROM role_permissions WHERE role_id = ? AND permission_id IN (?);`
        db.query(deleteQuery, data, (err, result) => {
            if (err) {
                res.send({ status: 'error', err: err });
                return;
            }

            res.send({status: 'success'});
        });
    })
});

module.exports = router;