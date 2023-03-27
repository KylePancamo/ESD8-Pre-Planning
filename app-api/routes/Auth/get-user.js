const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const createDBConnection = require("../mysql");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
    const sessionValue = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;

    if (sessionValue) {
        try {
            if (!req.session) {
                return;
            }
            const token = req.session.token;
            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            req.user = decoded;
            res.send(req.user);
        } catch (err) {
            console.log("Error decoding token")
            res.send({error: "Error decoding token"});
        }
    } else {
        console.log("Token not found");
        res.send({error: "Token not found"});

    }
});

module.exports = router;