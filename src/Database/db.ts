import mongoose from 'mongoose';

import { MONGODB_CONNECTION_URL } from '../config/config.js';
import { Plate } from '../types/plates.js';

import { plateCollection } from './schemas/plates.schema.js';

export class Database {
  public async connectToDb(): Promise<void> {
    try {
      await mongoose.connect(MONGODB_CONNECTION_URL);
      console.log('MongoDb connected');
    } catch (error) {
      console.error('MongoDb connection error:', error);
    }
  }

  public async addPlates(plates: Plate[]): Promise<void> {
    await plateCollection.insertMany(plates);
  }
}