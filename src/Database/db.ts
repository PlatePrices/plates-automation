import mongoose from 'mongoose';
import { DATABASE_CONFIG } from '../config/db.config.js';
import { plateCollection } from './schemas/plates.schema.js';
import { Plate } from '../types/plates.js';
import { savingLogs } from '../utils/saveLogs.js';

export class Database {
  public async connectToDb(): Promise<void> {
    try {
      await mongoose.connect(DATABASE_CONFIG.CONNECTION_STRING);
      console.log('MongoDb connected');
    } catch (error) {
      console.error('MongoDb connection error:', error);
    }
  }

  public async addPlates(plates: Plate[]): Promise<void> {
    await plateCollection.insertMany(plates);
  }
}
