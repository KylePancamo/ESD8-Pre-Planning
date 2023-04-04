module.exports = {
    databases: [
      {
        name: 'esd8_preplanning_db',
        dbConfig: {
          host: process.env.MYSQL_HOST_NAME,
          user: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_ROOT_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          connectionLimit: 100,
          waitForConnections: true,
          queueLimit: 0,
          multipleStatements: true,
        }
      },
      {
        name: 'auth',
        dbConfig: {
          host: process.env.MYSQL_HOST_NAME,
          user: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_ROOT_PASSWORD,
          database: process.env.MYSQL_AUTH_DATABASE,
          connectionLimit: 100,
          waitForConnections: true,
          queueLimit: 0,
          multipleStatements: true,
        }
      }
    ]
  };