const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const getPool = require("../mysql");
const verifyUserCredentials = require("../middleware/verifyUserCredentials");
const {isAdmin} = require("../middleware/authorization");
const logger = require("../../logger");

router.post("/",verifyUserCredentials, isAdmin, (req, res) => { 
    const db = getPool(process.env.MYSQL_AUTH_DATABASE);

    const { username } = req.body;
    const { password } = req.body;

    // bcrypt password
    const saltRounds = 10;
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        try {
            db.getConnection((err, connection) => {
                if (err) {
                    logger.warn(`Error connecting to database`, { error: `${err.message, err.stack}` });
                    res.send({ status: 'error', err: 'Internal Error' });
                    return;
                }

                const userExistQuery = `SELECT * FROM accounts WHERE username = ?;`;

                connection.query(userExistQuery, [username], (err, result) => {
                    if (err) {
                        logger.warn(`Error checking if user ${username} exists`, { error: `${err.message, err.stack}` });
                        res.send({ status: 'error', err: 'Internal Error' });
                        connection.release();
                        return;
                    }

                    if (result.length > 0) {
                        res.send({ status: 'error', err: `User ${username} already exists.` });
                        connection.release();
                        return;
                    }

                    let query = `INSERT INTO accounts (username, password) VALUES (?, ?);`;
                    let data = [username, hash];

                    connection.query(query, data, (err, result) => {
                        if (err) {
                            logger.warn(`Error creating user ${username}`, { error: `${err.message, err.stack}` });
                            res.send({ status: 'error', err: 'Internal Error.' });
                            connection.release();
                            return;
                        }

                        query = `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?);`;
                        data = [result.insertId, process.env.DEFAULT_USER_ROLE];

                        connection.query(query, data, (err, result) => {
                            if (err) {
                                logger.warn(`Error creating role 1 for user ${username}`, { error: `${err.message, err.stack}` });
                                res.send({ status: 'error', err: 'User successfully registered, but no role is assigned. Please modify the users role.' });
                                connection.release();
                                return;
                            }

                            res.send({ status: 'success', message:`Successfully registered user ${username}`  });
                            connection.release();
                        })
                    })
                });
            })
        } catch (err) {
            logger.warn(`Error creating user ${username}`, { error: `${err.message, err.stack}` });
            res.send({ status: 'error', err: 'Internal Error' });
            return;
        }

    })
});

module.exports = router;

