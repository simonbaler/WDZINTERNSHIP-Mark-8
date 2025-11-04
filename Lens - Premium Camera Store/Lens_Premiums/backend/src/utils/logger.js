/**
 * Logger Utility
 * 
 * Provides centralized logging functionality for the application.
 * Uses different log levels and formats based on the environment.
 */

const winston = require('winston');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// Create formatter
const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  levels,
  format,
  transports: [
    // Write all logs to console
    new winston.transports.Console(),
    
    // Write errors to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Add request logging helper
logger.logRequest = (req, message) => {
  logger.info(`${req.method} ${req.path} - ${message}`);
};

module.exports = { logger };