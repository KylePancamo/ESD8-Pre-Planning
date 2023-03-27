const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('./verifyUserCredentials');

router.post("/", (req, res) => {
    const db = createDBConnection("auth");

    const user_id = req.body.user_id;
    const passsword = req.body.password;

    const data = [
        passsword,
        user_id,
    ]
    
    const query = `UPDATE accounts SET password = ? WHERE id = ?;`;

    db.query(query, data, (err, result) => {
        if (err) {
            res.send({ status: 'error', err: err });
            return;
        }
        
        res.send({ status: 'success'});
    })

    
});

module.exports = router;