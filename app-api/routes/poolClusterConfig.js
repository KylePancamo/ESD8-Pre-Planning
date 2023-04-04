module.exports = {
    databases: [
      {
        name: process.env.MYSQL_ESD8_DATABASE,
        dbConfig: {
          host: process.env.MYSQL_HOST_NAME,
          user: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_ROOT_PASSWORD,
          database: process.env.MYSQL_ESD8_DATABASE,
          connectionLimit: 100,
          waitForConnections: true,
          queueLimit: 0,
          multipleStatements: true,
        }
      },
      {
        name: process.env.MYSQL_AUTH_DATABASE,
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