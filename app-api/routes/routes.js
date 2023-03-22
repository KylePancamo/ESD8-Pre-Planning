module.exports = (app) => {
    // declare routes here
    const insertMarkers = require('./Markers/insert-placed-marker');
    const updateMarkers = require('./Markers/update-map-marker');
    const fetchMarkers = require('./Markers/fetch-placed-markers');
    const deleteMarkers = require('./Markers/delete-all-markers');
    const deleteSeletedMarker = require('./Markers/delete-selected-marker');
    const uploadIcons = require('./Icons/upload-icon');
    const getUploadedIcons = require('./Icons/get-uploaded-icons');
    const getSidebarData = require('./Sidebar/get-sidebar-data');
    const addPreplanningLocation = require('./Preplanning/add-preplanning-location');
    const updatePreplanningLocation = require('./Preplanning/update-preplanning-location');
    const getPreplanningLocation = require('./Preplanning/get-preplanning-locations');
    const updateIconName = require('./Icons/update-icon-name');
    const checkFile = require('./Markers/check-file');
    const login = require('./Auth/login');
    const logout = require('./Auth/logout');
    const getUser = require('./Auth/get-user');
    const getUserRoles = require('./Auth/get-user-roles');
    const getRoles = require('./Auth/get-roles');
    const updateUserRole = require('./Auth/update-user-role');
    const getRolePermissions = require('./Auth/get-role-permissions');
    const insertRolePermissions = require('./Auth/insert-role-permissions');
    const deleteRolePermissions = require('./Auth/delete-role-permissions');
    const insertRoleAndPermissions = require('./Auth/insert-role-and-permissions');
    const deleteUser = require('./Auth/delete-user');
    const resetPassword = require('./Auth/reset-password');

    // mount routes here
    app.use('/api/insert-placed-marker', insertMarkers);
    app.use('/api/update-map-marker', updateMarkers);
    app.use('/api/fetch-placed-markers', fetchMarkers);
    app.use('/api/delete-all-markers', deleteMarkers);
    app.use('/api/delete-selected-marker', deleteSeletedMarker);
    app.use('/api/upload-icon', uploadIcons);
    app.use('/api/get-uploaded-icons', getUploadedIcons);
    app.use('/api/get-sidebar-data', getSidebarData);
    app.use('/api/add-preplanning-location', addPreplanningLocation);
    app.use('/api/update-preplanning-location', updatePreplanningLocation);
    app.use('/api/get-preplanning-locations', getPreplanningLocation);
    app.use('/api/update-icon-name', updateIconName);
    app.use('/api/check-file', checkFile);
    app.use('/api/login', login);
    app.use('/api/logout', logout);
    app.use('/api/get-user', getUser);
    app.use('/api/get-user-roles', getUserRoles);
    app.use('/api/get-roles', getRoles);
    app.use('/api/update-user-role', updateUserRole);
    app.use('/api/get-role-permissions', getRolePermissions);
    app.use('/api/insert-role-permissions', insertRolePermissions);
    app.use('/api/delete-role-permissions', deleteRolePermissions);
    app.use('/api/insert-role-and-permissions', insertRoleAndPermissions);
    app.use('/api/delete-user', deleteUser);
    app.use('/api/reset-password', resetPassword);
}