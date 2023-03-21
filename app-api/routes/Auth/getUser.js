const jwt = require('jsonwebtoken');

const getUser = (req, res, next) => {
    const token = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            
            req.user = decoded;
            next();
        } catch (err) {
            console.log("Invalid token/Token expired")
            res.send({error: "Invalid token/Token expired"});
        }
    } else {
        console.log("Invalid token/Token expired");
        res.send({error: "Token not found"});
    }
};

module.exports = getUser;