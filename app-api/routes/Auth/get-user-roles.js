const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('./verifyUserCredentials');

router.get("/", verifyUserCredentials, (req, res) => {
    const db = createDBConnection("auth");

    const user = req.user;

    const query = `
        SELECT a.id AS user_id, a.username, r.id AS role_id, r.name
        FROM accounts a
        JOIN user_roles ur ON a.id = ur.user_id
        JOIN roles r ON r.id = ur.role_id
        WHERE a.username != 'admin'
        GROUP BY a.id, a.username, r.id, r.name;
    `

    db.query(query, user.username, (err, result) => {
        if (err) {
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success', payload: result});
    })

});

module.exports = router;