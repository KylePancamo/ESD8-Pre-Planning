const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require("../middleware/verifyUserCredentials");
const {isAdmin} = require("../middleware/authorization");

router.post("/",verifyUserCredentials, isAdmin, (req, res) => { 
    const db = createDBConnection("auth");

    const u_name = req.body;
    const p_word = req.body;

    const query = `INSERT INTO users (username, password) VALUES (?, ?);`;

    const data = [u_name, p_word];
    db.query(query, data, (err, result) => {
        if (err) {
            res.send({ status: 'error', err: 'Error creating user.' });
            return;
        }

        res.send({status: 'success'});
    })

});

module.exports = router;

