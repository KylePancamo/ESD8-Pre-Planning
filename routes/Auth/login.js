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

    const query = `SELECT a.id, a.username, r.name, BIT_OR(p.security_hex) as permissions
                    FROM accounts a
                    JOIN user_roles ur ON a.id = ur.user_id
                    JOIN roles r ON r.id = ur.role_id
                    JOIN role_permissions rp ON rp.role_id = r.id
                    JOIN permissions p ON p.id = rp.permission_id
                    WHERE a.username = ?
                    GROUP BY a.id, a.username, a.password;`;

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
                        const permissions = parseInt(result[0].permissions.toString('hex'), 16);
                        result[0].permissions = permissions;
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