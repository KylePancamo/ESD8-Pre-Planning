const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const logger = require("../../logger");

router.get("/", (req, res) => {
    const token = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;
    try {
        req.session.destroy();
    } catch (err) {
        logger.warn("Error destroying session", {error: `${err.message, err.stack}`})
    }

    if (token) {
        res.clearCookie("token", {path: "/"});
        res.send({ status: 'success', message: 'Logged out successfully' } )
    } else {
        logger.warn("No token found")
        res.send({ status: 'error', message: 'No token found' } )
    }
});

module.exports = router;