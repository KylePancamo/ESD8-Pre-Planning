const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = createDBConnection("auth", true);

    const roleId = req.body.role.id;

    const query = `
            DELETE FROM user_roles WHERE role_id = ?;
            DELETE FROM role_permissions WHERE role_id = ?;
            DELETE FROM roles WHERE id = ?;
        `;

    const data = [roleId, roleId, roleId];

    db.query(query, data, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success'});
    })
});

module.exports = router;