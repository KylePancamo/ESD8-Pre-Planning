const jwt = require('jsonwebtoken');
const logger = require("../../logger");

const verifyUserCredentials = async (req, res, next) => { 
    const cookieValue = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;
    const session = await req.sessionStore.get(req.sessionID, (err, session) => {
        if (err) {
            logger.warn("Error getting session", {error: `${err.message, err.stack}`})
            return null;
        }
        if (!session) {
            return null;
        }

        return session;
    })

    if (!session) {
        logger.warn(`Session not found at file ${__filename}`);
        res.status(404).send({error: "Session not found"});
        return;
    }

    if (cookieValue) {
        try {
            const token = req.session.token;
            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            req.user = decoded;
            next();
        } catch (err) {
            logger.warn(`Error decoding token`, {error: `${err.message, err.stack}`})
            res.status(401).send({error: "Error decoding token"});
        }
    } else {
        logger.warn(`Token not found with sessionID ${req.sessionID}`, {
            error: `${err.message, err.stack}`,
            sessionID: req.sessionID
        })
        res.status(404).send({error: "Token not found"});

    }
};


module.exports = verifyUserCredentials;