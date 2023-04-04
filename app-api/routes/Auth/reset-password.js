const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const {isAdmin} = require('../middleware/authorization');
const logger = require("../../logger");

router.post("/", verifyUserCredentials, isAdmin, (req, res) => {
    const db = getPool("auth");

    const user_id = req.body.user_id;
    const passsword = req.body.password;

    const data = [
        passsword,
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

    
});

module.exports = router;