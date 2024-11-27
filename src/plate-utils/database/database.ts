import { sequalize } from '../../config.js';
import logger from '../logger/logger.js';
import { BasePlateSchemaType } from '../validation/plates.schema.js';
import { InvalidPlate, ValidPlates } from './schemas/plate.schema.js';

class Database {
  public async connectToDb(): Promise<void> {
    try {
      await sequalize.authenticate();
      logger.info('Database has been authenticated');
    } catch (error) {
      logger.error('Error authenticating database', error);
    }
  }

  public async addPlates(
    validPlates: BasePlateSchemaType[],
    invalidPlates: BasePlateSchemaType[],
  ): Promise<void> {
    await ValidPlates.bulkCreate(validPlates);
    await InvalidPlate.bulkCreate(invalidPlates);
  }

  //   public savePagePerformance(
  //     startPage: number,
  //     endPage: number,
  //     totalTimeTaken: number,
  //   ): void {}
  //   public saveSourcePerformance(source: string, totalTimeTaken: number): void {}
}

export default new Database();
