const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const logger = require("../../logger");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
    const sessionValue = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;

    if (!req.session) {
        return;
    }

    if (sessionValue) {
        try {
            const token = req.session.token;
            if (!token) {
                return;
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            req.user = decoded;
            res.send(req.user);
        } catch (err) {
            logger.warn("Error decoding token", {error: `${err.message, err.stack}`})
            res.send({error: "Error decoding token"});
        }
    } else {
        logger.warn("Session token not found")
        res.send({error: "Session token not found"});

    }
});

module.exports = router;