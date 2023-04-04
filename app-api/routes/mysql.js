// mysql.js
const mysql = require('mysql2');
const logger = require('../logger');
const clusterConfig = require('./poolClusterConfig');

const poolCluster = mysql.createPoolCluster({
  canRetry: true,
  removeNodeErrorCount: 1,
  restoreNodeTimeout: 10000,
  defaultSelector: 'RR'
});

clusterConfig.databases.forEach((database) => {
  poolCluster.add(database.name, database.dbConfig);
})

const getPool = (poolName) => {
  return poolCluster.of(poolName, 'RR');
}

module.exports = getPool;