import { sequalize } from '../config/config.js';
import Plate from './schemas/plates.schema.js';
import InvalidPlate from './schemas/invalidplates.schema.js';
import MainOperationPerformance from './schemas/mainOperationPerformance.schema.js';
import OperationPerformance from './schemas/operationPerformance.schema.js';
import PagePerformance from './schemas/pagePerformance.schema.js';
import logs from './schemas/logs.schema.js';
import { performanceType } from '../types/performance.js';

class Database {
  public async connectToDb(): Promise<void> {
    try {
      await sequalize.authenticate();
      console.log('MySQL connected');
    } catch (error) {
      console.error('MySQL connection error:', error);
    }
  }

  public async addValidPlates(plates: any[]): Promise<void> {
    await Plate.bulkCreate(plates);
  }

  public async addInvalidPlates(plates: any[]): Promise<void> {
    await InvalidPlate.bulkCreate(plates);
  }
  public async saveMainOperationPerformance(startTime: Date, endTime: Date, totalDurationMs: number): Promise<void> {
    await MainOperationPerformance.create({
      startTime: startTime,
      endTime: endTime,
      totalDurationMs: totalDurationMs,
    });
  }
  public async saveSourceOperationPerformance(
    source: string,
    startTime: Date,
    endTime: Date,
    totalDurationMs: number,
  ): Promise<{ operation_id: number }> {
    const newOperation = await OperationPerformance.create({
      source: source,
      startTime: startTime,
      endTime: endTime,
      totalDurationMs: totalDurationMs,
    });

    return {
      operation_id: newOperation.operation_id,
    };
  }

  public async savePagePerformance(operation_id: number, pagesPerformance: performanceType[]): Promise<void> {
    const pagesRecords = pagesPerformance.map((performance) => ({
      operation_id,
      page_number: performance.pageNumber,
      durationMs: performance.durationMs,
    }));

    await PagePerformance.bulkCreate(pagesRecords);
  }

  public async saveLogs(source: string, startTime: Date, level: string, message: string) {
    await logs.create({
      source: source,
      startTime: startTime,
      level: level,
      message: message,
    });
  }
}

export default new Database();
