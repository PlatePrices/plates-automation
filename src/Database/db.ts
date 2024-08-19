import mongoose from 'mongoose';

import { MONGODB_CONNECTION_URL } from '../config/config.js';
import { Plate } from '../types/plates.js';

import { invalidPlates } from './schemas/invalidplates.schema.js';
import { plateCollection } from './schemas/plates.schema.js';

class Database {
  public async connectToDb(): Promise<void> {
    try {
      await mongoose.connect(MONGODB_CONNECTION_URL);
      console.log('MongoDb connected');
    } catch (error) {
      console.error('MongoDb connection error:', error);
    }
  }

  public async addValidPlates(plates: Plate[]): Promise<void> {
    await plateCollection.insertMany(plates);
  }

  public async addInvalidPlates(plates: Plate[]): Promise<void> {
    await invalidPlates.insertMany(plates);
  }
}

export default new Database();
