const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const createDBConnection = require("../mysql");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
    const token = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            
            req.user = decoded;
            res.send(req.user);
        } catch (err) {
            console.log("Invalid token/Token expired")
            res.send({error: "Invalid token/Token expired"});
        }
    } else {
        console.log("Invalid token/Token expired");
        res.send({error: "Token not found"});
    }
});

module.exports = router;