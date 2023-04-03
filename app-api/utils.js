const getRequestIP = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

const hasPermission = (userPermissions, permission) => {
    return (userPermissions & permission) == permission;
}

module.exports = {
    hasPermission,
    getRequestIP
}