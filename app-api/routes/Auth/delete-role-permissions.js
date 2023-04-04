const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');
const { getRequestIP } = require('../../utils');
const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);
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

    db.getConnection((err, connection) => {
        if (err) {
            logger.warn(`Error getting connection for role ${roleId} with permissions ${removedPermissionsString}`, {
                error: err
            })
            res.send({ status: 'error', err: err });

            return;
        }

        connection.query(permissionIdQuery, data, (err, result) => {
            if (err) {
                logger.warn(`Error getting permission ids for role ${roleId} with permissions ${removedPermissionsString}`, {
                    error: err
                });
                res.send({ status: 'error', err: err });
                
                return;
            }

            const values = result.map(result => [result.id]);
            const data = [roleId, [values]];
            const deleteQuery = `DELETE FROM role_permissions WHERE role_id = ? AND permission_id IN (?);`;

            connection.query(deleteQuery, data, (err, result) => {
                if (err) {
                    logger.warn(`Error deleting role permissions for role ${roleId} with permissions ${removedPermissionsString}`, {
                        error: err
                    });
                    res.send({ status: 'error', err: err });
                    connection.release();
                    return;
                }
                logger.info(`Permissions ${removedPermissionsString} removed from role ${roleId} successfully`);
                res.send({status: 'success'});
                connection.release();
            });
        }).finally(() => {
            // if the connection has already been freed, we don't need to do anything
            if (connection) {
                connection.release();
            }
        });
    })
});

module.exports = router;