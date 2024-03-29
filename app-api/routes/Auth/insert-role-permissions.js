const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");

router.post("/", verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const role = req.body.role;
    const roleId = role.id;
    const permissionString = req.body.key;
    const addedPermissions = req.body.addedPermissions;
    const addedPermissionsString = addedPermissions.toString(16);

    const data = [addedPermissionsString, roleId];

    const permissionIdQuery = `SELECT p.id, p.name
            FROM permissions p
            WHERE (UNHEX(?) & p.security_hex) = p.security_hex;`;

    db.getConnection((err, connection) => {
        if (err) {
            logger.warn(`Error getting connection for role ${roleId} with permissions ${addedPermissionsString}`, {
                error: err
            });
            res.send({ status: 'error', err: err });

            return;
        }
        try {
            connection.query(permissionIdQuery, data, (err, result) => {
                if (err) {
                    logger.warn(`Error getting permission ids for role ${roleId} with permissions ${addedPermissionsString}`, {
                        error: err
                    });
                    res.send({ status: 'error', err: err });

                    return;
                }

                const values = result.map(result => [roleId, result.id, role.name + ': ' + result.name])
                const insertQuery = `INSERT INTO role_permissions (role_id, permission_id, description) VALUES ?;`
                connection.query(insertQuery, [values], (err, result) => {
                    if (err) {
                        logger.warn(`Error inserting role permissions for role ${roleId} with permissions ${addedPermissionsString}`, {
                            error: err
                        });
                        res.send({ status: 'error', err: err });

                        return;
                    }

                    logger.info(`Permissions ${addedPermissionsString} added to role ${roleId} successfully`);
                    res.send({status: 'success'});
                });
            });
        } catch (err) {
            logger.warn(`Error inserting role permissions for role ${roleId} with permissions ${addedPermissionsString}`, {
                error: err
            });
            res.send({ status: 'error', err: err });
        } finally {
            connection.release();
        }
    });
});

module.exports = router;