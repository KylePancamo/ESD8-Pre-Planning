const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get("/", (req, res) => {
    const token = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;
    req.session.destroy();

    if (token) {
        res.clearCookie("token", {path: "/"});
        res.send({ status: 'success', message: 'Logged out successfully' } )
    }
});

module.exports = router;