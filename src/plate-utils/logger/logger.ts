import winston, { createLogger, format, transports } from 'winston';

class Logger {
  logger: winston.Logger;
  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.timestamp(),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  info(message: string, ...args: unknown[]) {
    this.logger.info(
      `${message} ${args.map((arg) => JSON.stringify(arg)).join(' ')}`,
    );
  }
  error(message: string, ...args: unknown[]) {
    this.logger.info(
      `${message} ${args.map((arg) => JSON.stringify(arg)).join(' ')}`,
    );
  }
  debub(message: string, ...args: unknown[]) {
    this.logger.info(
      `${message} ${args.map((arg) => JSON.stringify(arg)).join(' ')}`,
    );
  }
  warn(message: string, ...args: unknown[]) {
    this.logger.info(
      `${message} ${args.map((arg) => JSON.stringify(arg)).join(' ')}`,
    );
  }
}

export default new Logger();
