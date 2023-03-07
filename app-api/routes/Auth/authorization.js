const getUser = require('./getUser');

const isAuthorized = (req, res, next) => {
    if (!req.user) {
        console.log("Unauthorized. Logging unauthorized access attempt");
        // log unauthorized access attempt to a file named unauthorized-access.log. Include IP address
        
        return res.status(401).send('Unauthorized. Logging unauthorized access attempt');
    }

    next();
}

module.exports = isAuthorized;