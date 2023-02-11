const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const createDBConnection = require("../mysql");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", (req, res) => {
    const db = createDBConnection("auth");
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
        "SELECT password FROM accounts WHERE username = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                //bcrypt.compare(password, result[0].password, (error, response) => {
                //    if (response) {
                        const token = jwt.sign({ username }, process.env.SECRET_KEY_JWT, { expiresIn: "24hr" });
                        res.cookie("token", token, { httpOnly: true });
                        res.send({ message: 'Logged in successfully', token } )
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