const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');

router.post("/", verifyUserCredentials, (req, res) => {
    const db = createDBConnection("auth");

    const role = req.body.role;
    const roleId = role.id;
    const permissionString = req.body.key;
    const addedPermissions = req.body.addedPermissions;
    const addedPermissionsString = addedPermissions.toString(16);

    const data = [addedPermissionsString, roleId];

    const permissionIdQuery = `SELECT p.id, p.name
            FROM permissions p
            WHERE (UNHEX(?) & p.security_hex) = p.security_hex;`;

    db.query(permissionIdQuery, data, (err, result) => {
        if (err) {
            res.send({ status: 'error', err: err });
            return;
        }
        const values = result.map(result => [roleId, result.id, role.name + ': ' + result.name])
        const insertQuery = `INSERT INTO role_permissions (role_id, permission_id, description) VALUES ?;`
        db.query(insertQuery, [values], (err, result) => {
            if (err) {
                res.send({ status: 'error', err: err });
                return;
            }
            res.send({status: 'success'});
        })
    })
});

module.exports = router;