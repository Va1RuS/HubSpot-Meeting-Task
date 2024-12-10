const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} ${level}: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += `\n${JSON.stringify(metadata, null, 2)}`;
          }
          return msg;
        })
      ),
    }),
  ],
});

module.exports = {
  info: (message, metadata = {}) => logger.info(message, metadata),
  error: (message, metadata = {}) => logger.error(message, metadata),
  warn: (message, metadata = {}) => logger.warn(message, metadata),
  debug: (message, metadata = {}) => logger.debug(message, metadata),
};
