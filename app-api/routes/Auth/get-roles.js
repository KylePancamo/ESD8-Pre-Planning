const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');


router.get("/", verifyUserCredentials, (req, res) => {
    const db = createDBConnection("auth");

    const query = `SELECT * from roles;`

    db.query(query, (err, result) => {
        if (err) {
            res.send({ status: 'error', err: err });
            return;
        }

        res.send({status: 'success', payload: result});
    })

});

module.exports = router;