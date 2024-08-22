import winston from 'winston';

import { colors, levels } from '../config/winstonConfiguration.js';

const logger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: 'src/logs/combined.log',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      filename: 'src/logs/errors.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
});

winston.addColors(colors);

export default logger;
