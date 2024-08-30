import winston from 'winston';
import database from '../Database/db.js';
import { colors, levels } from '../config/winstonConfiguration.js';
import { level } from '../types/logs.js';
class Logger {
  logger: winston.Logger;
  constructor() {
    this.logger = winston.createLogger({
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
  }

  public async log(source: string, level: level, message: string) {
    this.logger[level](message);
    await database.saveLogs(source, new Date(), level, message);
  }
}

export default new Logger();
