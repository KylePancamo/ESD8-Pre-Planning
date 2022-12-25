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
}