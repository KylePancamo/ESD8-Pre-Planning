const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');
const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const user_id = req.body.user_id;
    const password = req.body.password;

    
    const saltRounds = 10;
    
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            logger.warn(`Error hashing password for user ${user_id}`, {
                error: `${err.message, err.stack}`
            });
            res.send({ status: 'error', err: err });
            return;
        }

        const data = [
            hash,
            user_id,
        ]

        const query = `UPDATE accounts SET password = ? WHERE id = ?;`;
        db.query(query, data, (err, result) => {
            if (err) {
                logger.warn(`Error updating password for user ${user_id}`, {
                    error: `${err.message, err.stack}`
                });
                res.send({ status: 'error', err: err });
                return;
            }
            
            res.send({ status: 'success'});
        })
    })
    

    
});

module.exports = router;