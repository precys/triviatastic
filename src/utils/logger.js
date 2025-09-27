const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// create logger
const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [new transports.Console()]
});

// optional middleware for express
const loggerMiddleware = (req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
};

module.exports = { logger, loggerMiddleware };
