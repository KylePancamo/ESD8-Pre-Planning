const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const getUser = require('./getUser');
const isAuthorized = require('./authorization');

router.post("/", getUser, isAuthorized, (req, res) => {
    const db = createDBConnection("auth", true);

    const user = req.body;
    const user_id = user.user_id;

    const query = `
            DELETE FROM user_roles WHERE user_id = ?;
            DELETE FROM accounts WHERE id = ?;
        `;

    db.query(query, [user_id, user_id], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success'});
    })
});

module.exports = router;