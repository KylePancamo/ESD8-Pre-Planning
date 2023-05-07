const { hasPermission, getRequestIP } = require('../../utils');
const permissions = require('../../permissions');
const logger = require('../../logger');

const isAuthorized = (req, res, next) => {
    if (!req.user) {
        const ip = getRequestIP(req);
        const message = `Unauthorized access attempt at ${new Date().toISOString()} from IP ${ip}. URL: ${req.originalUrl}. Method: ${req.method}`;
        
        return res.status(401).send('Unauthorized. Logging unauthorized access attempt');
    }

    next();
}


const isAdmin = (req, res, next) => {
    const user = req.user;
    const role = user.name;
    if (role !== "admin") {
        const ip = getRequestIP(req);
        logger.info(`Unauthorized access attempt at ${new Date().toISOString()} from IP ${ip}. URL: ${req.originalUrl}. Method: ${req.method}`);
        return res.status(403).send({status: "error", message: "Unauthorized access attempt. Access attempt has been logged. "});
    }

    next();
}

const canModify = (req, res, next) => {
    const user = req.user;
    const userPermissions = user.permissions;
    
    if (!hasPermission(userPermissions, permissions.MODIFY)) {
        const ip = getRequestIP(req);
        logger.info(`Unauthorized access attempt at ${new Date().toISOString()} from IP ${ip}. URL: ${req.originalUrl}. Method: ${req.method}`);
        return res.status(403).send({error: "Forbidden"});
    }

    next();
}

const canView = (req, res, next) => {
    const user = req.user;
    const userPermissions = user.permissions;

    if (!hasPermission(userPermissions, permissions.VIEW)) {
        const ip = getRequestIP(req);
        logger.info(`Unauthorized access attempt at ${new Date().toISOString()} from IP ${ip}. URL: ${req.originalUrl}. Method: ${req.method}`);
        return res.status(403).send({error: "Forbidden"});
    }
    
    next();
}

const canDelete = (req, res, next) => {
    const user = req.user;
    const userPermissions = user.permissions;

    if (!hasPermission(userPermissions, permissions.DELETE)) {
        const ip = getRequestIP(req);
        logger.info(`Unauthorized access attempt at ${new Date().toISOString()} from IP ${ip}. URL: ${req.originalUrl}. Method: ${req.method}`);
        return res.status(403).send({error: "Forbidden"});
    }

    next();
}

module.exports = {
    isAuthorized,
    isAdmin,
    canModify,
    canView,
    canDelete
};