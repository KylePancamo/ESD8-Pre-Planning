const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");

router.get("/", verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const query = `SELECT r.id, r.name, COALESCE(BIT_OR(p.security_hex), 0) as combined_permissions
                FROM roles r
                LEFT JOIN role_permissions rp ON r.id = rp.role_id
                LEFT JOIN permissions p ON p.id = rp.permission_id
                WHERE r.name != 'admin'
                GROUP BY r.id, r.name;`

    db.query(query, (err, result) => {
        if (err) {
            logger.warn("Error getting roles", {
                error: `${err.message, err.stack}`   
            })
            res.send({ status: 'error', err: err });
            return;
        }

        result.map((role) => {
            return role.combined_permissions = parseInt(role.combined_permissions.toString('hex'), 16);
        })
        
        res.send({status: 'success', payload: result});
    })
});

module.exports = router;