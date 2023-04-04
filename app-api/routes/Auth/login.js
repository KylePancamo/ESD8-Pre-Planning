const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const getPool = require("../mysql");
const logger = require("../../logger");

const { getRequestIP } = require('../../utils');

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", (req, res) => {
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = `SELECT a.id, a.username, r.name, COALESCE(BIT_OR(p.security_hex), 0) as permissions
                    FROM accounts a
                    JOIN user_roles ur ON a.id = ur.user_id
                    JOIN roles r ON r.id = ur.role_id
                    LEFT JOIN role_permissions rp ON rp.role_id = r.id
                    LEFT JOIN permissions p ON p.id = rp.permission_id
                    WHERE a.username = ?
                    GROUP BY a.id, a.username, r.name;`;

    db.query(
        query,
        username,
        (err, result) => {
            if (err) {
                logger.warn("Error logging in", {
                    error: `${err.message, err.stack}`
                });
                res.send({ err: err });
                return;
            }
            if (result?.length > 0) {
                //bcrypt.compare(password, result[0].password, (error, response) => {
                //    if (response) {
                    try {
                        const permissions = parseInt(result[0].permissions.toString('hex'), 16);
                        const userData = {...result[0]};

                        const IP = getRequestIP(req);

                        userData.permissions = permissions;
                        const token = jwt.sign(userData, process.env.SECRET_KEY_JWT, { expiresIn: "24hr" });
                        req.session.userId = result[0].id;
                        req.session.token = token;
                        logger.info(`User ${username} logged in successfully at IP ${IP}`)
                        res.send({ message: 'Logged in successfully', token } )
                    } catch (err) {
                        logger.error("Error logging in", {
                            error: `${err.message, err.stack}`
                        });
                    }
                //    } else {
                //        res.send({ message: "Wrong username/password combination!" });
                //    }
                //});
            } else {
                res.send({ message: "User doesn't exist" });
            }
        }
    )
});

module.exports = router;