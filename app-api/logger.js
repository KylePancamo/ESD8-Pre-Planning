const{ createLogger, transports, format } = require('winston');

const { combine, timestamp, label, printf, prettyPrint, json } = format;
require('winston-daily-rotate-file');

const fileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    maxFiles: '14d'
});

const logger = createLogger({

  format: combine(
    timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    prettyPrint(),
    json(),
  ),
  transports: [
    fileRotateTransport,
    new transports.File({
        maxFiles: "14d",
        level: 'info',
        filename: 'logs/info.log' 
    }),
    new transports.File({
        maxFiles: "14d",
        level: 'error',
        filename: 'logs/error.log'
    }),
    new transports.File({
        maxFiles: "14d",
        level: 'warn',
        filename: 'logs/warn.log'
    }),
    new transports.Console()
  ]
});

module.exports = logger;