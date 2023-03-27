const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = createDBConnection("auth");

    const user = req.body;

    const query = `UPDATE user_roles set role_id = ? where user_id = ?;`
    const data = [user.role_id, user.user_id];

    db.query(query, data, (err, result) => {
        if (err) {
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success'});
    })

});

module.exports = router;