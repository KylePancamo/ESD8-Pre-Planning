const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const getUser = require('./getUser');

router.post("/", (req, res) => {
    const db = createDBConnection("auth");

    const roleId = req.body.role.id;
    const removedPermissions = req.body.removedPermissions;
    const removedPermissionsString = removedPermissions.toString(16);

    const data = [removedPermissionsString, roleId];

    const permissionIdQuery = `SELECT p.id, p.name
            FROM permissions p
            WHERE (UNHEX(?) & p.security_hex) = p.security_hex;`;

    db.query(permissionIdQuery, data, (err, result) => {
        if (err) {
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