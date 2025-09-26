const { createLogger, transports, format } = require("winston");
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, "app.log"), level: "info" }),
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logDir, "test.log"), level: "debug" })
  ],
});


function loggerMiddleware(req, res, next){
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

module.exports = {
  logger,
  loggerMiddleware
}