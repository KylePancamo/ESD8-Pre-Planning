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

    const query = `SELECT a.id, a.username, r.name AS role_name, p.name AS permission_type, p.id AS permission
                FROM accounts AS a
                JOIN user_roles AS ur ON a.id = ur.user_id
                JOIN roles AS r ON ur.role_id = r.id
                JOIN role_permissions AS rp ON r.id = rp.role_id
                JOIN permissions AS p ON rp.permission_id = p.id
                WHERE a.username = ?`;

    db.query(
        query,
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                //bcrypt.compare(password, result[0].password, (error, response) => {
                //    if (response) {
                        const token = jwt.sign(result[0], process.env.SECRET_KEY_JWT, { expiresIn: "24hr" });
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