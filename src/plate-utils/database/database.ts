import { sequalize } from '../../config.js';
import logger from '../logger/logger.js';

class Database {
  public async connectToDb(): Promise<void> {
    try {
      await sequalize.authenticate();
      logger.info('Database has been authenticated');
    } catch (error) {
      logger.error('Error authenticating database', error);
    }
  }
}

export default new Database();
