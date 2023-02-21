const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");

router.get("/", (req, res) => {
    const db = createDBConnection("auth");

    const query = `SELECT r.id, r.name, BIT_OR(p.security_hex) as combined_permissions
                    FROM roles r
                    JOIN role_permissions rp ON r.id = rp.role_id
                    JOIN permissions p ON p.id = rp.permission_id
                    GROUP BY r.id, r.name;`

    db.query(query, (err, result) => {
        if (err) {
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