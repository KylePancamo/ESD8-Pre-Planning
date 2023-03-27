const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const getUser = require('./verifyUserCredentials');

router.post("/", (req, res) => {
    const db = createDBConnection("auth");

    const role = req.body.role;
    const addedPermissions = req.body.addedPermissions;
    const addedPermissionsString = addedPermissions.toString(16);
    
    const insertRoleQuery = `INSERT INTO roles (name) VALUES (?);`

    db.query(insertRoleQuery, [role], (err, result) => {
        if (err) {
            res.send({ status: 'error', err: err });
            return;
        }

        const roleId = result.insertId;
        const permissionIdQuery = `SELECT p.id, p.name
            FROM permissions p
            WHERE (UNHEX(?) & p.security_hex) = p.security_hex;`;
            
        db.query(permissionIdQuery, addedPermissionsString, (err, result) => {
            if (err) {
                res.send({ status: 'error', err: err });
                return;
            }
            const values = result.map(result => [roleId, result.id, role + ': ' + result.name])
            const insertQuery = `INSERT INTO role_permissions (role_id, permission_id, description) VALUES ?;`
            db.query(insertQuery, [values], (err, result) => {
                if (err) {
                    res.send({ status: 'error', err: err });
                    return;
                }
                res.send({status: 'success', payload: {roleId: roleId}});
            })
        })
    })

    
});

module.exports = router;