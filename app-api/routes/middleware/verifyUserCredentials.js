const jwt = require('jsonwebtoken');

const verifyUserCredentials = async (req, res, next) => { 
    const cookieValue = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;
    const session = await req.sessionStore.get(req.sessionID, (err, session) => {
        if (err || !session) {
            return null;
        }

        return session;
    })

    if (!session) {
        console.log("Session " + req.sessionID + " not found");
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
            console.log("Error decoding token")
            res.status(401).send({error: "Error decoding token"});
        }
    } else {
        console.log("Token not found");
        res.status(404).send({error: "Token not found"});

    }
};


module.exports = verifyUserCredentials;