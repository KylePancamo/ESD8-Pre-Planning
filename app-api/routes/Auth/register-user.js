const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require("../middleware/verifyUserCredentials");
const {isAdmin} = require("../middleware/authorization");
const logger = require("../../logger");

router.post("/",verifyUserCredentials, isAdmin, (req, res) => { 
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const u_name = req.body;
    const p_word = req.body;

    const query = `INSERT INTO users (username, password) VALUES (?, ?);`;

    const data = [u_name, p_word];
    db.query(query, data, (err, result) => {
        if (err) {
            logger.warn(`Error creating user ${u_name}`, {
                error: `${err.message, err.stack}`
            });
            res.send({ status: 'error', err: 'Error creating user.' });
            return;
        }

        res.send({status: 'success'});
    })

    query = `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?);`;
    data = [result.insertId, 2];
    db.query(query, data, (err, result) => {
        if (err) {
            logger.warn(`Error creating role ${data[1]} for user ${data[0]}`, { error: `${err.message, err.stack}` });
            res.send({ status: 'error', err: 'Error creating user.' });
            return;
        }
        res.send({ status: 'success'});
    })


});

module.exports = router;

